package com.yongheon.backend.Web.Service;

import java.util.ArrayList;

import javax.inject.Inject;

import org.springframework.stereotype.Service;

import com.yongheon.backend.Web.DAO.SubjectDAO;
import com.yongheon.backend.Web.DTO.SubjectDTO;

@Service
public class SubjectServiceImpl implements SubjectService {

    @Inject
    SubjectDAO subjectDAO;

    @Override
    public void createSubject(String id, String title, String description, String admin) throws Exception {
        subjectDAO.createSubject(new SubjectDTO(id, title, description, admin));
    }

    @Override
    public SubjectDTO getSubject(String id) {
        return subjectDAO.getSubject(id);
    }

    @Override
    public ArrayList<SubjectDTO> getSubjectAll() {
        return subjectDAO.getSubjectAll();
    }
}
