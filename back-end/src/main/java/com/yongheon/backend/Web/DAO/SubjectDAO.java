package com.yongheon.backend.Web.DAO;

import java.util.ArrayList;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import com.yongheon.backend.Web.DTO.SubjectDTO;

@Mapper
@Repository
public interface SubjectDAO {

    public void createSubject(SubjectDTO subjectDTO) throws Exception;

    public SubjectDTO getSubject(String id);

    public ArrayList<SubjectDTO> getSubjectAll();

    public int getBoardTotal(String id);

    public String getAdmin(String id);

    public void updateBoardTotal(SubjectDTO dto);

    public void updateSubject(SubjectDTO dto);
}
