package com.yongheon.backend.Web.Service;

import javax.inject.Inject;

import org.apache.ibatis.binding.BindingException;
import org.springframework.stereotype.Service;

import com.yongheon.backend.Web.DAO.RecommendDAO;
import com.yongheon.backend.Web.DTO.RecommendDTO;

@Service
public class RecommendServiceImpl implements RecommendService {

    @Inject
    RecommendDAO dao;

    @Override
    public void setRecommend(RecommendDTO dto) {
        dao.setRecommend(dto);
    }

    @Override
    public Boolean checkDuplicate(RecommendDTO dto) {
        try {
            dao.checkDuplicate(dto);
            return true;
        } catch (BindingException e) {
            return false;
        }
    }

}
