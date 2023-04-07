package com.yongheon.backend.Web.DTO;

import java.util.ArrayList;
import java.util.Date;

import org.springframework.format.annotation.DateTimeFormat;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BoardDTO {
    private int bno; // 게시물 번호
    private String sid;
    private int s_bno;
    private String user_id; // 게시판을 읽을 때 게시판을 작성한 유저일 경우 encode 시에 user_id 값을 id로 초기화 아니면 null (작성한 유저일 경우
                            // 삭제 또는 수정 버튼이 뜨도록 만들기 위해서)
    private String writer;
    private String title;
    private String content; // html 코드
    private int view;
    private int recommend;
    private String reg_date;
    private String update_date;
    private String pw; // 게시판 리스트를 클라이언트로 돌려보낼 때는 null: 비밀글 아님, "nonpw": 비밀번호가 설정되지 않은 비밀글, "pw": 비밀번호가
                       // 설정된 비밀글
    private Boolean deleted;

    public BoardDTO(String sid, int s_bno, String user_id, String writer, String title, String content, String pw) {
        this.sid = sid;
        this.s_bno = s_bno;
        this.user_id = user_id;
        this.writer = writer;
        this.title = title;
        this.content = content;
        this.pw = pw;
    }
}
