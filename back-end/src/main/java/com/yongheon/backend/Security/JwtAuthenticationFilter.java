package com.yongheon.backend.Security;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.inject.Inject;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Inject
    JwtTokenProvider jwtTokenProvider;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            String accessToken = request.getHeader("Authorization");
            JwtTokenProvider.TokenStatus tokenStatus = jwtTokenProvider.validateAccessToken(accessToken);

            if (tokenStatus == JwtTokenProvider.TokenStatus.EXPIRED) {
                Cookie[] cookieList = request.getCookies();
                if (cookieList != null) {
                    for (Cookie cookie : cookieList) {
                        if (cookie.getName().equals("refreshToken")) {
                            filterChain.doFilter(request, response);
                            return;
                        }
                    }
                }
                response.sendError(303);
                return;
            }

            if (tokenStatus == JwtTokenProvider.TokenStatus.EMPTY) {
                request.setAttribute("unauthorization", 401); // 권한 없음
                filterChain.doFilter(request, response);
                return;
            }

            if (tokenStatus == JwtTokenProvider.TokenStatus.VALID) {
                String id = jwtTokenProvider.getIdFromAccessToken(accessToken); // jwt에서 사용자 id를 꺼낸다.
                String auth = jwtTokenProvider.getAuthFromAccessToken(accessToken);
                List<GrantedAuthority> authorities = new ArrayList<>();

                authorities.add(new SimpleGrantedAuthority(auth));
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(id, null,
                        authorities); // id를 인증한다.
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request)); // 기본적으로 제공한
                                                                                                       // details 세팅

                SecurityContextHolder.getContext().setAuthentication(authentication); // 세션에서 계속 사용하기 위해
                                                                                      // securityContext에 Authentication
                                                                                      // 등록
                filterChain.doFilter(request, response);
                return;
            }

            if (tokenStatus == JwtTokenProvider.TokenStatus.INVALID) {
                request.setAttribute("unauthorization", 400); // 잘못된 요청(유효치 않은 토큰)
            }
        } catch (Exception ex) {
            logger.error("Could not set user authentication in security context", ex);
        }
        filterChain.doFilter(request, response);
    }
}
