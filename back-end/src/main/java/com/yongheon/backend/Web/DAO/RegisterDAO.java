package com.yongheon.backend.Web.DAO;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import com.yongheon.backend.Web.DTO.RegisterDTO;

@Mapper
@Repository
public interface RegisterDAO {
    public String isExistId(String id) throws Exception;

    public String isExistNick(String nick) throws Exception;

    public String isExistEmail(String email) throws Exception;

    public Boolean register(RegisterDTO registerDTO) throws Exception;

    public Boolean registerOAuth(RegisterDTO registerDTO) throws Exception;
}
