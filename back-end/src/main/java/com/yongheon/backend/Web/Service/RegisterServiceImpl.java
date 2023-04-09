package com.yongheon.backend.Web.Service;

import java.util.regex.Pattern;

import javax.inject.Inject;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.yongheon.backend.Web.DAO.RegisterDAO;
import com.yongheon.backend.Web.DTO.RegisterDTO;

@Service
public class RegisterServiceImpl implements RegisterService {
    @Inject
    private RegisterDAO dao;

    @Override
    public Boolean idRegExp(String id) throws Exception {
        String regExp = "^[a-z0-9_-]{5,20}$";
        return Pattern.matches(regExp, id);
    }

    @Override
    public Boolean pwRegExp(String pw) throws Exception {
        String regExp = "^[a-zA-Z0-9{}\\[\\]/?.,;:|)*~`!^-_+<>@#$%&\\=('\"]{8,16}$";
        return Pattern.matches(regExp, pw);
    }

    @Override
    public Boolean nickRegExp(String nick) throws Exception {
        String regExp = "^[a-zA-Z0-9_-ㄱ-ㅎㅏ-ㅣ가-힣]{5,20}$";
        return Pattern.matches(regExp, nick);
    }

    @Override
    public Boolean emailRegExp(String email) throws Exception {
        String regExp = "^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]*$";
        return Pattern.matches(regExp, email);
    }

    @Override
    public Boolean isExistId(String id) throws Exception {
        return dao.isExistId(id) != null;
    }

    @Override
    public Boolean isExistNick(String nick) throws Exception {
        return dao.isExistNick(nick) != null;
    }

    @Override
    public Boolean isExistEmail(String email) throws Exception {
        return dao.isExistEmail(email) != null;
    }

    private Boolean isValidId(String id) throws Exception {
        if (!idRegExp(id))
            return false;
        return !isExistId(id);
    }

    private Boolean isValidPw(String pw) throws Exception {
        return pwRegExp(pw);
    }

    private Boolean isValidNick(String nick) throws Exception {
        if (!nickRegExp(nick))
            return false;
        return !isExistNick(nick);
    }

    private Boolean isValidEmail(String email) throws Exception {
        if (!emailRegExp(email))
            return false;
        return !isExistEmail(email);
    }

    @Override
    public Boolean register(RegisterDTO registerDTO) throws Exception {
        try {
            if (!isValidId(registerDTO.getId()))
                return false;
            if (!isValidPw(registerDTO.getPw()))
                return false;
            if (!isValidNick(registerDTO.getNick()))
                return false;
            if (!isValidEmail(registerDTO.getEmail()))
                return false;
            return dao.register(registerDTO);
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}
