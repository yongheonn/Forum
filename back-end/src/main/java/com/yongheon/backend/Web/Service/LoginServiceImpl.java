package com.yongheon.backend.Web.Service;

import java.util.regex.Pattern;

import javax.inject.Inject;

import org.springframework.stereotype.Service;

import com.yongheon.backend.Web.DAO.LoginDAO;
import com.yongheon.backend.Web.DTO.LoginDTO;

@Service
public class LoginServiceImpl implements LoginService {
    @Inject
    private LoginDAO dao;

    private Boolean idRegExp(String id) {
        String regExp = "^[a-z|0-9|_-]{5,20}$";
        return Pattern.matches(regExp, id);
    }

    private Boolean pwRegExp(String pw) {
        String regExp = "^[a-z|A-Z|0-9|{}\\[\\]/?.,;:|)*~`!^-_+<>@#$%&\\=('\"]{8,16}$";
        return Pattern.matches(regExp, pw);
    }

    @Override
    public Status login(LoginDTO loginDTO) {
        try {
            if (!idRegExp(loginDTO.getId()))
                return Status.FAIL;
            if (!pwRegExp(loginDTO.getPw()))
                return Status.FAIL;
            if ((dao.login(loginDTO)) == null)
                return Status.FAIL;
            return Status.OK;
        } catch (Exception e) {
            e.printStackTrace();
            return Status.ERROR;
        }
    }

}
