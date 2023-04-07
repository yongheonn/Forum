package com.yongheon.backend.Web.Service;

import com.yongheon.backend.Web.DTO.RecommendDTO;

public interface RecommendService {
    public void setRecommend(RecommendDTO dto);

    public Boolean checkDuplicate(RecommendDTO dto);
}
