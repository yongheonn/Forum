package com.yongheon.backend.Web.Controller;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping(value = "/ajax/logout/*")
public class LogoutController {

    @Value("${api-url}")
    private String api_url;

    @PostMapping(value = "/")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) throws IOException {
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
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
