package com.yongheon.backend.Web.DTO;

import lombok.Data;

@Data
public class RecommendDTO {
    private int rno;
    private int bno;
    private String user_id;

    public RecommendDTO(int bno, String user_id) {
        this.bno = bno;
        this.user_id = user_id;
    }
}
