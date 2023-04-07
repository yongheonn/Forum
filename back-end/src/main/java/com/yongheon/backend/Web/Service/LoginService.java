package com.yongheon.backend.Web.Service;

import com.yongheon.backend.Web.DTO.LoginDTO;

public interface LoginService {
    public enum Status {
        ERROR, OK, FAIL
    };

    public Status login(LoginDTO loginDTO) throws Exception;
}