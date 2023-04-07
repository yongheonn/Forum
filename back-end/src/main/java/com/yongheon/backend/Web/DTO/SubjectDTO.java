package com.yongheon.backend.Web.DTO;

import lombok.Data;

@Data
public class SubjectDTO {
    private String id;
    private String title;
    private String description;
    private String admin;
    private int btotal; // 총 게시물 개수

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
