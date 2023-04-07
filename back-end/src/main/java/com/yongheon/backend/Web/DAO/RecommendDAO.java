package com.yongheon.backend.Web.DAO;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import com.yongheon.backend.Web.DTO.RecommendDTO;

@Mapper
@Repository
public interface RecommendDAO {
    public void setRecommend(RecommendDTO dto);

    public int checkDuplicate(RecommendDTO dto);
}
