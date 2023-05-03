package com.yongheon.backend.Web.DAO;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import com.yongheon.backend.Web.DTO.LoginDTO;

@Mapper
@Repository
public interface LoginDAO {
    public String login(LoginDTO loginDTO);

    public String loginOAuth(String email);

}
