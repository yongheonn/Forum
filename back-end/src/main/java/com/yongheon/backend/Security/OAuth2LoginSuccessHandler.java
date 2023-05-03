package com.yongheon.backend.Security;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
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
import java.nio.ByteBuffer;
import java.sql.SQLIntegrityConstraintViolationException;
import java.util.UUID;

@Slf4j
@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final RegisterDAO registerDAO;
    private final LoginDAO loginDAO;
    private final JwtTokenProvider jwtTokenProvider;

    @Value("${front-url}")
    private String frontUrl;

    @Value("${domain}")
    private String domain;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
            Authentication authentication) throws IOException, ServletException {
        log.info("OAuth2 Login 성공!");
        try {
            DefaultOAuth2User oAuth2User = (DefaultOAuth2User) authentication.getPrincipal();
            log.info(oAuth2User.toString());
            // User의 Role이 GUEST일 경우 처음 요청한 회원이므로 회원가입
            if (oAuth2User.getAuthorities().toArray()[0].toString() == "ROLE_GUEST") {
                log.info("회원가입 시도");

                String id = UUID.randomUUID().toString();
                String nick = UUID.randomUUID().toString();
                id = id.replaceAll("-", "");
                nick = nick.replaceAll("-", "");
                id = "id_" + id.substring(0, 15);
                nick = "user_" + nick.substring(0, 15);
                if (!tryRegister(id, nick, oAuth2User, 0))
                    getRedirectStrategy().sendRedirect(request, response, frontUrl + "/auth/oauth/redirect/error");
                String accessToken = jwtTokenProvider.generateAccessToken(id,
                        "ROLE_GUEST");
                String url = frontUrl + "/auth/oauth/redirect?access_token=" + accessToken;

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
                        .domain(domain)
                        .httpOnly(true)
                        .secure(true)
                        .maxAge(8200000)
                        .build();

                response.addHeader("Set-Cookie", cookie.toString());
                response.setStatus(200);
                response.setContentType("application/json");

                getRedirectStrategy().sendRedirect(request, response, url);
            } else {
                loginSuccess(request, response, oAuth2User);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

    private Boolean tryRegister(String id, String nick, DefaultOAuth2User oAuth2User, int tryNum) {
        try {
            if (tryNum == 5)
                return false;
            registerDAO.registerOAuth(new RegisterDTO(id,
                    nick, oAuth2User.getAttribute("email")));
            return true;

        } catch (SQLIntegrityConstraintViolationException e) {
            e.printStackTrace();
            return tryRegister(id, nick, oAuth2User, tryNum++);
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    private void loginSuccess(HttpServletRequest request, HttpServletResponse response, DefaultOAuth2User oAuth2User)
            throws IOException {
        String id = loginDAO.loginOAuth(oAuth2User.getAttribute("email"));
        String accessToken = jwtTokenProvider.generateAccessToken(id,
                "ROLE_USER_CERT");
        String url = frontUrl + "/auth/oauth/redirect?access_token=" + accessToken;

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
                .domain(domain)
                .httpOnly(true)
                .secure(true)
                .maxAge(8200000)
                .build();

        response.addHeader("Set-Cookie", cookie.toString());
        response.setStatus(200);
        response.setContentType("application/json");

        getRedirectStrategy().sendRedirect(request, response, url);
    }
}