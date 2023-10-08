package com.yongheon.backend.Web.Controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping(value = "/ajax/health/*")
public class HealthController {

    @GetMapping(value = "/")
    public ResponseEntity<?> checkHealthStatus() {
        return new ResponseEntity<>(HttpStatus.OK);

    }

}
