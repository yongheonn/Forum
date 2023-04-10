package com.yongheon.backend.Web.Controller;

import java.io.IOException;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Value;
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
            Cookie cookie = new Cookie("refreshToken", null);
            cookie.setMaxAge(0);
            cookie.setSecure(true);
            cookie.setHttpOnly(true);
            cookie.setPath(api_url + "/ajax/auth/refresh");
            cookie.setDomain("yongheonn.com");
            response.addCookie(cookie);
        } catch (Exception e) {
            e.printStackTrace();
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }
}
