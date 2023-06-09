package com.yongheon.backend.Web.Service;

import java.util.UUID;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;

import org.apache.ibatis.javassist.NotFoundException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.yongheon.backend.Web.DAO.UserDAO;
import com.yongheon.backend.Web.DTO.UserDTO;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class UserServiceImpl implements UserService {
    @Inject
    private UserDAO dao;

    @Inject
    private RedisUtilService redisUtil;

    @Inject
    private JavaMailSender emailSender;

    @Inject
    private RegisterService registerService;

    @Value("${front-url}")
    private String front_url;

    @Override
    public String getEmail(String id) {
        try {
            return dao.getEmail(id);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @Override
    public String getAuth(String id) {
        try {
            int auth = dao.getAuth(id);

            if (auth == 0)
                return "ROLE_GUEST";
            if (auth == 1)
                return "ROLE_USER_NONCERT";
            if (auth == 2)
                return "ROLE_USER_CERT";
            if (auth == 3)
                return "ROLE_ADMIN";
            return null;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @Override
    public UserDTO getUser(String id) {
        try {

            return dao.getUser(id);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @Override
    public String getNick(String id) {
        try {
            return dao.getNick(id);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @Override
    public boolean setNick(UserDTO userDTO) {
        try {
            if (registerService.isValidNick(userDTO.getNick())) {
                dao.setNick(userDTO);
                return true;
            }
            return false;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public boolean setAuth(String auth) {
        try {

            if (auth.equals("ROLE_GUEST"))
                return dao.setAuth(0);
            if (auth.equals("ROLE_USER_NONCERT"))
                return dao.setAuth(1);
            if (auth.equals("ROLE_USER_CERT"))
                return dao.setAuth(2);
            if (auth.equals("ROLE_ADMIN"))
                return dao.setAuth(3);
            return false;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public void sendMail(String to, String sub, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setFrom("helper@yongheonn.com");
        message.setSubject(sub);
        message.setText(text);
        emailSender.send(message);
    }

    @Override
    public void sendVerificationMail(String email, String id) {
        try {
            String VERIFICATION_LINK = front_url + "/auth/email/";
            if (email == null)
                throw new NotFoundException("이메일이 없음.");
            UUID uuid = UUID.randomUUID();
            // redis에 링크 정보 저장
            redisUtil.setDataExpire(id + uuid.toString(), email, 60 * 30L);
            // 인증 링크 전송
            sendMail(email, "계정 인증메일입니다.", VERIFICATION_LINK + id + '/' + uuid.toString());
            log.info("이메일 발송 성공");
        } catch (Exception e) {
            log.error("send mail error", e);
        }
    }

    @Override
    public void verifyEmail(String id, String key) throws NotFoundException {
        String memberEmail = redisUtil.getData(id + key);
        if (memberEmail == null)
            throw new NotFoundException("유효하지 않은 링크입니다.");
        dao.verifyUser(id);
        redisUtil.deleteData(id + key);
    }

    @Override
    public String getUserIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip != null) {
            ip = ip.split(",")[0];
        }
        if (ip == null) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (ip == null) {
            ip = request.getHeader("WL-Proxy-Client-IP"); // 웹로직
        }
        if (ip == null) {
            ip = request.getHeader("HTTP_CLIENT_IP");
        }
        if (ip == null) {
            ip = request.getHeader("HTTP_X_FORWARDED_FOR");
        }
        if (ip == null) {
            ip = request.getRemoteAddr();
        }
        return ip;
    }

}
