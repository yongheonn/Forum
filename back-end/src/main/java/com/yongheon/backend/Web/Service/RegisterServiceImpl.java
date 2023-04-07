package com.yongheon.backend.Web.Service;

import java.util.regex.Pattern;

import javax.inject.Inject;

import org.springframework.stereotype.Service;

import com.yongheon.backend.Web.DAO.RegisterDAO;
import com.yongheon.backend.Web.DTO.RegisterDTO;

@Service
public class RegisterServiceImpl implements RegisterService {
    @Inject
    private RegisterDAO dao;

    private Boolean idRegExp(String id) throws Exception {
        String regExp = "^[a-z|0-9|_-]{5,20}$";
        return Pattern.matches(regExp, id);
    }

    private Boolean pwRegExp(String pw) throws Exception {
        String regExp = "^[a-z|A-Z|0-9|{}\\[\\]/?.,;:|)*~`!^-_+<>@#$%&\\=('\"]{8,16}$";
        return Pattern.matches(regExp, pw);
    }

    private Boolean nickRegExp(String nick) throws Exception {
        String regExp = "^[a-z|A-Z|0-9|_-|ㄱ-ㅎ|ㅏ-ㅣ|가-힣]{5,20}$";
        return Pattern.matches(regExp, nick);
    }

    private Boolean emailRegExp(String email) throws Exception {
        String regExp = "^[0-9|a-z|A-Z]([-_.]?[0-9|a-z|A-Z])*@[0-9|a-z|A-Z]([-_.]?[0-9|a-z|A-Z])*.[a-z|A-Z]*$";
        return Pattern.matches(regExp, email);
    }

    private Boolean isExistId(String id) throws Exception {
        return dao.isExistId(id) != null;
    }

    private Boolean isExistNick(String nick) throws Exception {
        return dao.isExistNick(nick) != null;
    }

    private Boolean isExistEmail(String email) throws Exception {
        return dao.isExistEmail(email) != null;
    }

    @Override
    public Boolean validId(String id) throws Exception {
        if (!idRegExp(id))
            return false;
        return !isExistId(id);
    }

    @Override
    public Boolean validPw(String pw) throws Exception {
        return pwRegExp(pw);
    }

    @Override
    public Boolean validNick(String nick) throws Exception {
        if (!nickRegExp(nick))
            return false;
        return !isExistNick(nick);
    }

    @Override
    public Boolean validEmail(String email) throws Exception {
        if (!emailRegExp(email))
            return false;
        return !isExistEmail(email);
    }

    @Override
    public Boolean register(RegisterDTO registerDTO) throws Exception {
        try {
            if (!(validId(registerDTO.getId())))
                return false;
            if (!(validPw(registerDTO.getPw())))
                return false;
            if (!(validNick(registerDTO.getNick())))
                return false;
            if (!(validEmail(registerDTO.getEmail())))
                return false;
            return dao.register(registerDTO);
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}
