package com.yongheon.backend.Web.Controller;

import java.io.IOException;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/ajax/logout/*")
public class LogoutController {

    @Value("${api-url}")
    private String api_url;

    @PostMapping(value = "/")
    public void login(HttpServletResponse response) throws IOException {
        try {
            ResponseCookie cookie = ResponseCookie.from("refreshToken", null)
                    .path("/ajax/auth/refresh")
                    .sameSite("None")
                    .domain("yongheonn.com")
                    .httpOnly(true)
                    .secure(true)
                    .maxAge(0)
                    .build();

            response.addHeader("Set-Cookie", cookie.toString());
        } catch (Exception e) {
            e.printStackTrace();
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }
}
