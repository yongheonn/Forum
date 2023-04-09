package com.yongheon.backend.Web.Controller;

import java.io.IOException;

import javax.inject.Inject;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.google.gson.GsonBuilder;
import com.yongheon.backend.Security.JwtTokenProvider;
import com.yongheon.backend.Web.DTO.LoginDTO;
import com.yongheon.backend.Web.Service.LoginService;
import com.yongheon.backend.Web.Service.UserService;
import com.yongheon.backend.Web.Service.LoginService.Status;

@RestController
@RequestMapping(value = "/ajax/login/*")
public class LoginController {
	@Inject
	private LoginService loginService;

	@Inject
	UserService userService;

	@Inject
	private JwtTokenProvider jwtTokenProvider;

	@PostMapping(value = "/")
	public ResponseEntity<?> login(@RequestBody LoginDTO data, HttpServletRequest request,
			HttpServletResponse response) throws IOException {
		try {
			Status status = loginService.login(data);
			if (status == Status.FAIL) {
				return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
			}
			if (status == Status.ERROR)
				throw new Error();

			String auth = userService.getAuth(data.getId());
			if (auth == null) {
				return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
			}
			String accessToken = jwtTokenProvider.generateAccessToken(data.getId(), auth);
			response.setHeader("Authorization", accessToken);

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

			String refreshToken = jwtTokenProvider.generateRefreshToken(data.getId(), ip);
			Cookie cookie = new Cookie("refreshToken", refreshToken);
			cookie.setHttpOnly(true);
			cookie.setSecure(true);
			cookie.setPath("/ajax/auth/refresh");
			cookie.setMaxAge(8200000);
			response.addCookie(cookie);
			String jsonData = new GsonBuilder().serializeNulls().create().toJson(userService.getUser(data.getId()));
			return new ResponseEntity<>(jsonData, HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
