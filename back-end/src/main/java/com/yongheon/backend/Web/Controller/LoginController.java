package com.yongheon.backend.Web.Controller;

import java.io.IOException;

import javax.inject.Inject;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
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

	@Value("${api-url}")
	private String api_url;

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
			System.out.println("X-Forwarded-For ip: " + ip);
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

			String refreshToken = jwtTokenProvider.generateRefreshToken(data.getId(), ip);

			ResponseCookie cookie = ResponseCookie.from("refreshToken", refreshToken)
					.path("/ajax/auth/refresh")
					.sameSite("None")
					.domain("yongheonn.com")
					.httpOnly(true)
					.secure(true)
					.maxAge(8200000)
					.build();

			response.addHeader("Set-Cookie", cookie.toString());
			String jsonData = new GsonBuilder().serializeNulls().create().toJson(userService.getUser(data.getId()));
			return new ResponseEntity<>(jsonData, HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
