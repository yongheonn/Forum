package com.yongheon.backend.Web.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegisterDTO {
    private String id;
    private String pw;
    private String nick;
    private String email;

    public RegisterDTO(String id, String nick, String email) {
        this.id = id;
        this.nick = nick;
        this.email = email;
    }
}
