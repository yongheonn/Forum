package com.yongheon.backend.Web.Service;

import java.util.ArrayList;

import com.yongheon.backend.Web.DTO.SubjectDTO;

public interface SubjectService {
    public void createSubject(SubjectDTO subjectDTO) throws Exception;

    public SubjectDTO getSubject(String id);

    public ArrayList<SubjectDTO> getSubjectAll();

    public String getAdmin(String id);

    public void updateSubject(SubjectDTO subjectDTO);
}
