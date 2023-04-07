package com.yongheon.backend.Web.Service;

import java.util.ArrayList;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.GrantedAuthority;

import com.yongheon.backend.Web.DTO.BoardDTO;

public interface BoardService {
    public boolean regExpContent(BoardDTO boardDTO);

    public HttpStatus insertBoard(BoardDTO dto);

    public BoardDTO[] getBoardPage(int page, String sid);

    public BoardDTO getBoard(int bno);

    public int getBNO(BoardDTO dto);

    public void updateBoard(BoardDTO dto);

    public void toSecretTitle(BoardDTO[] list, String id, String auth); // 제목과 비밀번호 리셋

    public void encode(BoardDTO[] list, String auth); // 비밀번호만 리셋

    public void encode(BoardDTO board, String user_id, String auth); // 비밀번호만 리셋

    public void updateView(int bno);

    public void deleteBoard(int bno);

    public void recommend(int bno);
}
