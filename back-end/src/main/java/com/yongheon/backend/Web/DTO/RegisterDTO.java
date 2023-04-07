package com.yongheon.backend.Web.DTO;

import lombok.Data;

@Data
public class RegisterDTO {
    private String id;
    private String pw;
    private String nick;
    private String email;
}
