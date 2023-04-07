package com.yongheon.backend.Web.DTO;

import lombok.Data;

@Data
public class UserDTO {
    private String id;
    private String nick;
    private String email;
    private int auth;
}
