package com.yongheon.backend.Web.Controller;

import java.util.Map;

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
import com.yongheon.backend.Web.DTO.RegisterDTO;
import com.yongheon.backend.Web.Service.RegisterService;

@RestController
@RequestMapping(value = "/ajax/register/*")
public class RegisterController {

	@Inject
	private RegisterService service;

	@Inject
	private JwtTokenProvider jwtTokenProvider;

	@PostMapping(value = "")
	public ResponseEntity<?> register(@RequestBody RegisterDTO data, HttpServletRequest request,
			HttpServletResponse response) {
		try {

			String accessToken = jwtTokenProvider.generateAccessToken(data.getId(), "ROLE_USER_NONCERT");
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
			Boolean isValid = service.register(data);
			if (!isValid)
				return new ResponseEntity<>(HttpStatus.BAD_REQUEST);

			String refreshToken = jwtTokenProvider.generateRefreshToken(data.getId(), ip);
			Cookie cookie = new Cookie("refreshToken", refreshToken);
			cookie.setHttpOnly(true);
			cookie.setSecure(true);
			cookie.setPath("/ajax/auth/refresh");
			response.addCookie(cookie);

			return new ResponseEntity<>(HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<>("Server Error", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@PostMapping(value = "/id-exist")
	public ResponseEntity<?> checkIDExist(@RequestBody Map<String, String> idMap) {
		try {
			String id = idMap.get("id");
			if (!service.idRegExp(id))
				return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
			return new ResponseEntity<>(service.isExistId(id), HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@PostMapping(value = "/nick-exist")
	public ResponseEntity<?> checkNickExist(@RequestBody Map<String, String> nickMap) {
		try {
			String nick = nickMap.get("nick");
			if (!service.nickRegExp(nick))
				return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
			return new ResponseEntity<>(service.isExistNick(nick), HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<>("Server Error", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@PostMapping(value = "/email-exist")
	public ResponseEntity<?> checkEmailExist(@RequestBody Map<String, String> emailMap) {
		try {
			String email = emailMap.get("email");
			if (!service.emailRegExp(email))
				return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
			return new ResponseEntity<>(service.isExistEmail(email), HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<>("Server Error", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
