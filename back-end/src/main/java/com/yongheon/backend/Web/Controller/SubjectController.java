package com.yongheon.backend.Web.Controller;

import java.util.ArrayList;

import javax.inject.Inject;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.google.gson.GsonBuilder;
import com.yongheon.backend.Web.DTO.SubjectDTO;
import com.yongheon.backend.Web.Service.SubjectService;

@RestController
@RequestMapping(value = "/ajax/subject/*")
public class SubjectController {
    @Inject
    SubjectService subjectService;

    @PostMapping("/regi")
    public ResponseEntity<?> regiSubject(@RequestBody SubjectDTO data) {
        try {
            String id = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            data.setAdmin(id);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/get")
    public ResponseEntity<?> getSubject(@RequestParam String sid) {
        try {
            SubjectDTO subject = subjectService.getSubject(sid);
            String jsonData = new GsonBuilder().serializeNulls().create().toJson(subject);
            return new ResponseEntity<>(jsonData, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/all")
    public ResponseEntity<?> getSubjectAll() {
        try {
            ArrayList<SubjectDTO> list = subjectService.getSubjectAll();
            String jsonData = new GsonBuilder().serializeNulls().create().toJson(list);
            return new ResponseEntity<>(jsonData, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/update")
    public ResponseEntity<?> updateSubject(@RequestParam String subject) {
        try {
            String id = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/delete")
    public ResponseEntity<?> deleteSubject(@RequestParam String subject) {
        try {
            String id = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
