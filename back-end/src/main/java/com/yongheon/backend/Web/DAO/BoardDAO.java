package com.yongheon.backend.Web.DAO;

import java.util.ArrayList;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import com.yongheon.backend.Web.DTO.BoardDTO;
import com.yongheon.backend.Web.DTO.BoardListParaDTO;

@Mapper
@Repository
public interface BoardDAO {
    public void insertBoard(BoardDTO dto);

    public BoardDTO[] getBoardPage(BoardListParaDTO dto);

    public BoardDTO getBoard(int bno);

    public void updateBoard(BoardDTO dto);

    public int getBNO(BoardDTO dto);

    public int getBoardTotal(String sid);

    public void updateView(int bno);

    public void deleteBoard(int bno);

    public void updateRecommendNum(int bno);
}
