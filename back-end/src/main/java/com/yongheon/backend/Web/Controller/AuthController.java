package com.yongheon.backend.Web.Controller;

import java.io.IOException;

import javax.inject.Inject;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.ibatis.javassist.NotFoundException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.yongheon.backend.Security.JwtTokenProvider;
import com.yongheon.backend.Web.Service.UserService;

@RestController
@RequestMapping(value = "/ajax/auth/*")
public class AuthController {

    @Inject
    private UserService userService;

    @Inject
    private JwtTokenProvider jwtTokenProvider;

    @Value("${api-url}")
    private String api_url;

    @PostMapping("/email")
    public ResponseEntity<?> verify(@AuthenticationPrincipal String id) {
        try {
            String email = userService.getEmail(id);

            userService.sendVerificationMail(email, id);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/email/waiting")
    public ResponseEntity<?> checkVerify(@AuthenticationPrincipal String id) {
        try {
            String auth = userService.getAuth(id);

            if (auth.equals("ROLE_USER_CERT"))
                return new ResponseEntity<>(HttpStatus.OK);

            return new ResponseEntity<>(HttpStatus.ACCEPTED);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/email/verify")
    public ResponseEntity<?> getVerify(@RequestParam String id, @RequestParam String key, HttpServletResponse response,
            HttpServletRequest request)
            throws NotFoundException {
        try {
            System.out.println("id: " + id);
            System.out.println("key: " + key);
            userService.verifyEmail(id, key);

            String newAccessToken = jwtTokenProvider.generateAccessToken(id, "ROLE_USER_CERT");
            response.setHeader("Authorization", newAccessToken);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(HttpServletRequest request,
            HttpServletResponse response, @CookieValue(value = "refreshToken") String refreshToken) throws IOException {
        try {
            String ip = request.getHeader("X-Forwarded-For");
            if (ip == null) {
                ip = request.getHeader("Proxy-Client-IP");
            }
            if (ip == null) {
                ip = request.getHeader("WL-Proxy-Client-IP"); // 웹로직
            }
            if (ip == null) {
                ip = request.getHeader("HTTP_CLIENT_IP");
            }
            if (ip == null) {
                ip = request.getHeader("HTTP_X_FORWARDED_FOR");
            }
            if (ip == null) {
                ip = request.getRemoteAddr();
            }

            String accessToken = request.getHeader("Authorization");

            System.out.println("refreshToken: " + refreshToken);
            JwtTokenProvider.TokenStatus tokenStatus = jwtTokenProvider.validateRefreshToken(refreshToken, ip);
            /*
             * 리프레시 토큰이 유효할 때, 액세스 토큰 재발급
             */
            if (tokenStatus == JwtTokenProvider.TokenStatus.VALID) {
                String newAccessToken = jwtTokenProvider.regenerateAccessToken(accessToken);
                response.setHeader("Authorization", newAccessToken);
                return new ResponseEntity<>(HttpStatus.OK);
            }
            /*
             * 리프레시 토큰이 유효치 않을 때, 리프레시 토큰 삭제 & 액세스 토큰 삭제(프론트 단에서 처리)
             */
            else {
                Cookie cookie = new Cookie("refreshToken", null);
                cookie.setHttpOnly(true);
                cookie.setSecure(true);
                cookie.setMaxAge(0);
                cookie.setPath("/ajax/auth/refresh/");
                response.addCookie(cookie);
                cookie.setDomain("yongheonn.com");
                return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
            }

        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
