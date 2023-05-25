package com.yongheon.backend.Web.Service;

import com.yongheon.backend.Web.DTO.RegisterDTO;

public interface RegisterService {
    public Boolean idRegExp(String id) throws Exception;

    public Boolean pwRegExp(String pw) throws Exception;

    public Boolean nickRegExp(String nick) throws Exception;

    public Boolean emailRegExp(String email) throws Exception;

    public Boolean isValidId(String id) throws Exception;

    public Boolean isValidPw(String id) throws Exception;

    public Boolean isValidNick(String id) throws Exception;

    public Boolean isValidEmail(String id) throws Exception;

    public Boolean isExistId(String id) throws Exception;

    public Boolean isExistNick(String nick) throws Exception;

    public Boolean isExistEmail(String email) throws Exception;

    public Boolean register(RegisterDTO registerDTO) throws Exception;
}