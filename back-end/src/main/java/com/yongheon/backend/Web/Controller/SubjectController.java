package com.yongheon.backend.Web.Controller;

import java.util.ArrayList;

import javax.inject.Inject;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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
    public ResponseEntity<?> regiSubject(@AuthenticationPrincipal String id, @RequestBody SubjectDTO subject) {
        try {
            String auth = SecurityContextHolder.getContext().getAuthentication()
                    .getAuthorities().toArray()[0].toString();
            System.out.println("주제: " + subject);
            if (!auth.equals("ROLE_ADMIN")) // 관리자 권한이 있거나 본인 아이디가 아닌 관리자를 부여한 경우가 아닐 때
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);

            subjectService.createSubject(subject);
            String jsonData = new GsonBuilder().serializeNulls().create().toJson(subject.getId());

            return new ResponseEntity<>(jsonData, HttpStatus.OK);
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
    public ResponseEntity<?> updateSubject(@AuthenticationPrincipal String id, @RequestBody SubjectDTO subject) {
        try {
            String auth = SecurityContextHolder.getContext().getAuthentication()
                    .getAuthorities().toArray()[0].toString();
            if (!auth.equals("ROLE_ADMIN") && !subjectService.getAdmin(subject.getId()).equals(id)) // 관리자 권한이 있거나 작성자인
                                                                                                    // 경우가 아닐 때
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            subjectService.updateSubject(subject);
            System.out.println("업데이트 주제: " + subject);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/delete")
    public ResponseEntity<?> deleteSubject(@RequestParam String subject) {
        try {

            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
