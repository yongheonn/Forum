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
    public void createSubject(SubjectDTO subjectDTO) throws Exception {
        subjectDAO.createSubject(subjectDTO);
    }

    @Override
    public SubjectDTO getSubject(String id) {
        return subjectDAO.getSubject(id);
    }

    @Override
    public ArrayList<SubjectDTO> getSubjectAll() {
        return subjectDAO.getSubjectAll();
    }

    @Override
    public String getAdmin(String id) {
        return subjectDAO.getAdmin(id);
    }

    @Override
    public void updateSubject(SubjectDTO subjectDTO) {
        subjectDAO.updateSubject(subjectDTO);
    }
}
