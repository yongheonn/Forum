package com.yongheon.backend.Web.DTO;

import lombok.Data;

@Data
public class BoardListParaDTO {
    private int page;
    private String sid;
    private int btotal;

    public BoardListParaDTO(int page, String sid, int btotal) {
        this.page = page;
        this.sid = sid;
        this.btotal = btotal;
    }
}
