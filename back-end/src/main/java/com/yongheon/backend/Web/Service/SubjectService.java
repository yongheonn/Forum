package com.yongheon.backend.Web.Service;

import java.util.ArrayList;

import com.yongheon.backend.Web.DTO.SubjectDTO;

public interface SubjectService {
    public void createSubject(String id, String title, String description, String admin) throws Exception;

    public SubjectDTO getSubject(String id);

    public ArrayList<SubjectDTO> getSubjectAll();
}
