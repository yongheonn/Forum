package com.yongheon.backend.Web.Service;

import org.apache.ibatis.javassist.NotFoundException;

import com.yongheon.backend.Web.DTO.UserDTO;

public interface UserService {
    public String getEmail(String id);

    public String getAuth(String id);

    public UserDTO getUser(String id);

    public String getNick(String id);

    public boolean setAuth(String auth);

    public void sendMail(String to, String sub, String text);

    public void sendVerificationMail(String email, String id) throws NotFoundException;

    public void verifyEmail(String id, String key) throws NotFoundException;
}