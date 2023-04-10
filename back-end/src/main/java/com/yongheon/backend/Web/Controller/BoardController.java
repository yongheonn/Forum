package com.yongheon.backend.Web.Controller;

import javax.inject.Inject;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.google.gson.GsonBuilder;
import com.yongheon.backend.Web.DTO.BoardDTO;
import com.yongheon.backend.Web.DTO.RecommendDTO;
import com.yongheon.backend.Web.Service.BoardService;
import com.yongheon.backend.Web.Service.RecommendService;
import com.yongheon.backend.Web.Service.SubjectService;
import com.yongheon.backend.Web.Service.UserService;

@RestController
@RequestMapping(value = "/ajax/board/*")
public class BoardController {
    @Inject
    BoardService boardService;

    @Inject
    SubjectService subjectService;

    @Inject
    UserService userService;

    @Inject
    RecommendService recommendService;

    @PostMapping("/create")
    public ResponseEntity<?> regiBoard(@AuthenticationPrincipal String id, @RequestBody BoardDTO boardDTO) {
        try {
            boardDTO.setUser_id(id);
            String nick = userService.getNick(id);
            boardDTO.setWriter(nick);
            if (!boardService.regExpContent(boardDTO))
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            HttpStatus status = boardService.insertBoard(boardDTO);
            String jsonData = new GsonBuilder().serializeNulls().create().toJson(boardService.getBNO(boardDTO));
            return new ResponseEntity<>(jsonData, status);

        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/list")
    public ResponseEntity<?> getBoardList(@AuthenticationPrincipal String id, @RequestParam String sid,
            @RequestParam int page) {
        try {
            String auth = SecurityContextHolder.getContext().getAuthentication()
                    .getAuthorities().toArray()[0].toString();
            BoardDTO[] list = boardService.getBoardPage(page, sid);
            boardService.encode(list, auth);
            // boardService.toSecretTitle(list, id, auth);
            String jsonData = new GsonBuilder().serializeNulls().create().toJson(list);
            return new ResponseEntity<>(jsonData, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/read")
    public ResponseEntity<?> getBoard(@AuthenticationPrincipal String id, @RequestParam int bno) {
        try {
            String auth = SecurityContextHolder.getContext().getAuthentication()
                    .getAuthorities().toArray()[0].toString();
            BoardDTO board = boardService.getBoard(bno);
            if (board.getDeleted())
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            if (!auth.equals("ROLE_ADMIN") && !board.getUser_id().equals(id)) {
                if (board.getPw() != null) {
                    if (board.getPw().equals("nonpw"))
                        return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
                    return new ResponseEntity<>(HttpStatus.PRECONDITION_REQUIRED);
                }
            }
            boardService.updateView(bno);
            boardService.encode(board, id, auth);
            String jsonData = new GsonBuilder().serializeNulls().create().toJson(board);
            return new ResponseEntity<>(jsonData, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/read-secret")
    public ResponseEntity<?> getSecretBoard(@AuthenticationPrincipal String id, @RequestParam("bno") int bno,
            @RequestParam("pw") String pw) {
        try {
            String auth = SecurityContextHolder.getContext().getAuthentication()
                    .getAuthorities().toArray()[0].toString();

            BoardDTO board = boardService.getBoard(bno);

            if (board.getDeleted())
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);

            if (!boardService.checkPw(pw)) // 올바르지 않은 비밀번호가 전송되었을 때
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            if (!board.getPw().equals(pw)) // 비밀번호가 틀렸을 때
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            boardService.encode(board, id, auth);

            String jsonData = new GsonBuilder().serializeNulls().create().toJson(board);

            return new ResponseEntity<>(jsonData, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/update")
    public ResponseEntity<?> updateBoard(@AuthenticationPrincipal String id, @RequestBody BoardDTO boardUpdated) {
        try {
            BoardDTO board = boardService.getBoard(boardUpdated.getBno());
            if (!board.getUser_id().equals(id)) // 작성자인 경우가 아닐 때
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            if (!boardService.regExpContent(boardUpdated))
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            boardService.updateBoard(boardUpdated);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/delete")
    public ResponseEntity<?> deleteBoard(@AuthenticationPrincipal String id, @RequestBody int bno) {
        try {
            String auth = SecurityContextHolder.getContext().getAuthentication()
                    .getAuthorities().toArray()[0].toString();
            BoardDTO board = boardService.getBoard(bno);
            if (!auth.equals("ROLE_ADMIN") && !board.getUser_id().equals(id)) // 관리자 권한이 있거나 작성자인 경우가 아닐 때
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            boardService.deleteBoard(bno);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/recommend")
    public ResponseEntity<?> recommend(@AuthenticationPrincipal String id, @RequestBody int bno) {
        try {
            String auth = SecurityContextHolder.getContext().getAuthentication()
                    .getAuthorities().toArray()[0].toString();
            BoardDTO board = boardService.getBoard(bno);
            if (board.getDeleted())
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);

            if (board.getPw() != null && !auth.equals("ROLE_ADMIN") && !board.getUser_id().equals(id)) {
                return new ResponseEntity<>(HttpStatus.PRECONDITION_REQUIRED);
            }

            RecommendDTO recommendDTO = new RecommendDTO(bno, id);
            Boolean isDuplicate = recommendService.checkDuplicate(recommendDTO);
            System.out.println(isDuplicate);
            if (isDuplicate)
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            recommendService.setRecommend(recommendDTO);
            boardService.recommend(bno);

            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
