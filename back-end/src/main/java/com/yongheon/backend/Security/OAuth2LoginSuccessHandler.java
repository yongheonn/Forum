package com.yongheon.backend.Security;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.google.gson.GsonBuilder;
import com.yongheon.backend.Web.DAO.LoginDAO;
import com.yongheon.backend.Web.DAO.RegisterDAO;
import com.yongheon.backend.Web.DTO.RegisterDTO;
import com.yongheon.backend.Web.Service.UserService;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.UUID;

@Slf4j
@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final RegisterDAO registerDAO;
    private final LoginDAO loginDAO;
    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
            Authentication authentication) throws IOException, ServletException {
        log.info("OAuth2 Login 성공!");
        try {
            DefaultOAuth2User oAuth2User = (DefaultOAuth2User) authentication.getPrincipal();

            // User의 Role이 GUEST일 경우 처음 요청한 회원이므로 회원가입 페이지로 리다이렉트
            if (oAuth2User.getAuthorities().toArray()[0].toString() == "Role.GUEST") {
                String id = "id_" + UUID.randomUUID().toString();
                String nick = "user_" + UUID.randomUUID().toString();
                registerDAO.registerOAuth(new RegisterDTO(id,
                        nick, oAuth2User.getAttribute("email")));
                String accessToken = jwtTokenProvider.generateAccessToken(id,
                        "Role.GUEST");
                response.setHeader("Authorization", accessToken);

                String ip = request.getHeader("X-Forwarded-For");

                if (ip != null) {
                    ip = ip.split(",")[0];
                    System.out.println("X-Forwarded-For ip: " + ip);
                }
                if (ip == null) {
                    ip = request.getHeader("Proxy-Client-IP");
                    System.out.println("Proxy-Client-IP ip: " + ip);
                }
                if (ip == null) {
                    ip = request.getHeader("WL-Proxy-Client-IP"); // 웹로직
                    System.out.println("WL-Proxy-Client-IP ip: " + ip);
                }
                if (ip == null) {
                    ip = request.getHeader("HTTP_CLIENT_IP");
                    System.out.println("HTTP_CLIENT_IP ip: " + ip);
                }
                if (ip == null) {
                    ip = request.getHeader("HTTP_X_FORWARDED_FOR");
                    System.out.println("HTTP_X_FORWARDED_FOR ip: " + ip);
                }
                if (ip == null) {
                    ip = request.getRemoteAddr();
                    System.out.println("getRemoteAddr ip: " + ip);
                }

                String refreshToken = jwtTokenProvider.generateRefreshToken(id, ip);

                ResponseCookie cookie = ResponseCookie.from("refreshToken", refreshToken)
                        .path("/ajax/auth/refresh")
                        .sameSite("None")
                        .domain("yongheonn.com")
                        .httpOnly(true)
                        .secure(true)
                        .maxAge(8200000)
                        .build();

                response.addHeader("Set-Cookie", cookie.toString());
                response.setStatus(200);
                response.setContentType("application/json");

                String jsonData = new GsonBuilder().serializeNulls().create().toJson(userService.getUser(id));
                response.getWriter().write(jsonData);
            } else {
                loginSuccess(request, response, oAuth2User); // 로그인에 성공한 경우 access, refresh 토큰 생성
            }
        } catch (Exception e) {
            //
        }

    }

    // TODO : 소셜 로그인 시에도 무조건 토큰 생성하지 말고 JWT 인증 필터처럼 RefreshToken 유/무에 따라 다르게 처리해보기
    private void loginSuccess(HttpServletRequest request, HttpServletResponse response, DefaultOAuth2User oAuth2User)
            throws IOException {
        String id = loginDAO.loginOAuth(oAuth2User.getAttribute("email"));
        String accessToken = jwtTokenProvider.generateAccessToken(id,
                "Role.GUEST");
        response.setHeader("Authorization", accessToken);

        String ip = request.getHeader("X-Forwarded-For");

        if (ip != null) {
            ip = ip.split(",")[0];
            System.out.println("X-Forwarded-For ip: " + ip);
        }
        if (ip == null) {
            ip = request.getHeader("Proxy-Client-IP");
            System.out.println("Proxy-Client-IP ip: " + ip);
        }
        if (ip == null) {
            ip = request.getHeader("WL-Proxy-Client-IP"); // 웹로직
            System.out.println("WL-Proxy-Client-IP ip: " + ip);
        }
        if (ip == null) {
            ip = request.getHeader("HTTP_CLIENT_IP");
            System.out.println("HTTP_CLIENT_IP ip: " + ip);
        }
        if (ip == null) {
            ip = request.getHeader("HTTP_X_FORWARDED_FOR");
            System.out.println("HTTP_X_FORWARDED_FOR ip: " + ip);
        }
        if (ip == null) {
            ip = request.getRemoteAddr();
            System.out.println("getRemoteAddr ip: " + ip);
        }

        String refreshToken = jwtTokenProvider.generateRefreshToken(id, ip);

        ResponseCookie cookie = ResponseCookie.from("refreshToken", refreshToken)
                .path("/ajax/auth/refresh")
                .sameSite("None")
                .domain("yongheonn.com")
                .httpOnly(true)
                .secure(true)
                .maxAge(8200000)
                .build();

        response.addHeader("Set-Cookie", cookie.toString());
        response.setStatus(200);
        response.setContentType("application/json");

        String jsonData = new GsonBuilder().serializeNulls().create().toJson(userService.getUser(id));
        response.getWriter().write(jsonData);
    }
}