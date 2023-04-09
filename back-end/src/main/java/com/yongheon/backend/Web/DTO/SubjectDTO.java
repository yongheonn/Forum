package com.yongheon.backend.Web.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SubjectDTO {
    private String id;
    private String title;
    private String description;
    private String admin;
    private int btotal; // 총 게시물 개수

    public SubjectDTO(SubjectDTO subjectDTO) {
        this.id = subjectDTO.id;
        this.title = subjectDTO.title;
        this.description = subjectDTO.description;
        this.admin = subjectDTO.admin;
    }

    public SubjectDTO(String id, String title, String description, String admin) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.admin = admin;
    }

    public SubjectDTO(String id, int btotal) {
        this.id = id;
        this.btotal = btotal;
    }
}
