package com.yongheon.backend.Web.DAO;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import com.yongheon.backend.Web.DTO.UserDTO;

@Mapper
@Repository
public interface UserDAO {
    public String getEmail(String id);

    public int getAuth(String id);

    public UserDTO getUser(String id);

    public UserDTO[] getUserList(String[] id);

    public String getNick(String id);

    public boolean setAuth(int auth);

    public void verifyUser(String id);
}
