package com.yongheon.backend.Web.Controller;

import java.util.Map;

import javax.inject.Inject;
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
import com.yongheon.backend.Web.DTO.RegisterDTO;
import com.yongheon.backend.Web.Service.RegisterService;
import com.yongheon.backend.Web.Service.UserService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping(value = "/ajax/register/*")
public class RegisterController {

	@Inject
	private RegisterService service;

	@Inject
	private UserService userService;

	@Inject
	private JwtTokenProvider jwtTokenProvider;

	@Value("${api-url}")
	private String api_url;

	@PostMapping(value = "")
	public ResponseEntity<?> register(@RequestBody RegisterDTO data, HttpServletRequest request,
			HttpServletResponse response) {
		try {

			String accessToken = jwtTokenProvider.generateAccessToken(data.getId(), "ROLE_USER_NONCERT");
			response.setHeader("Authorization", accessToken);

			String ip = userService.getUserIp(request);
			Boolean isValid = service.register(data);
			if (!isValid)
				return new ResponseEntity<>(HttpStatus.BAD_REQUEST);

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
