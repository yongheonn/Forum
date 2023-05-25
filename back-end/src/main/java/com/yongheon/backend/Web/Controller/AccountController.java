package com.yongheon.backend.Web.Controller;

import javax.inject.Inject;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.google.gson.GsonBuilder;
import com.yongheon.backend.Web.DTO.UserDTO;
import com.yongheon.backend.Web.Service.RegisterService;
import com.yongheon.backend.Web.Service.UserService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping(value = "/ajax/account/*")
public class AccountController {
    @Inject
    private UserService userService;

    @PostMapping(value = "/")
    public ResponseEntity<?> getAccount(@AuthenticationPrincipal String id) {
        try {
            String jsonData = new GsonBuilder().serializeNulls().create().toJson(userService.getUser(id));
            return new ResponseEntity<>(jsonData, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("Server Error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping(value = "/update")
    public ResponseEntity<?> updateAccount(@AuthenticationPrincipal String id, @RequestBody UserDTO userDTO) {
        try {
            userDTO.setId(id);
            if (userService.setNick(userDTO))
                return new ResponseEntity<>(HttpStatus.OK);
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("Server Error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
