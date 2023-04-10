package com.yongheon.backend.Web.Service;

import java.util.regex.Pattern;

import javax.inject.Inject;

import org.apache.ibatis.binding.BindingException;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import com.yongheon.backend.Web.DAO.BoardDAO;
import com.yongheon.backend.Web.DAO.SubjectDAO;
import com.yongheon.backend.Web.DTO.BoardDTO;
import com.yongheon.backend.Web.DTO.BoardListParaDTO;
import com.yongheon.backend.Web.DTO.SubjectDTO;

@Service
public class BoardServiceImpl implements BoardService {
    @Inject
    private BoardDAO boardDAO;

    @Inject
    private SubjectDAO subjectDAO;

    /*
     * private String strFilter(String content, Pattern p) {
     * Matcher matcher = p.matcher(content);
     * if (matcher.find()) {
     * return matcher.group();
     * }
     * return null;
     * }
     */
    /*
     * 비정상 태그 script나 iframe 있을 경우
     */
    @Override
    public boolean regExpContent(BoardDTO boardDTO) {
        boolean isValid = true;
        String pw = boardDTO.getPw();
        if (pw != null) {
            String pwPattern = "[a-zA-Z0-9]{6}|nonpw";
            isValid = isValid && Pattern.matches(pwPattern, pw);
        }
        String contentPattern = "<(script|iframe).*?>"; // 미완성
        isValid = isValid && !Pattern.matches(contentPattern, boardDTO.getContent());
        return isValid;
    }

    /*
     * 비정상 태그 제거
     * ex: <script><p>123</p></script>의 경우 script 태그 내부 p까지 전부 제거
     * ex: <p><script></script></p>의 경우 내부 script 태그만 제거
     * ex: <script/>나 <script> 같은 단독 태그 역시 제거
     */
    /*
     * private void regExpContent(BoardDTO boardDTO) {
     * 
     * Pattern pattern = Pattern.compile("<[^/]*?>.*?(</.*?>)*"); // 미완성
     * Matcher matcher = pattern.matcher(boardDTO.getContent());
     * String regExp = "<(p|a|img|video|span|br).*?>";
     * 
     * while (matcher.find()) {
     * String para = matcher.group();
     * if (Pattern.matches(null, para))
     * ;
     * }
     * String result = boardDTO.getContent().replaceAll(regExp, "");
     * boardDTO.setContent(result);
     * }
     */

    // html 파서 역할이었지만 content 저장 방식을 단순화하기로 결정
    /*
     * private ArrayList<ContentDTO> convertStrToDTO(BoardDTO boardDTO) {
     * int bno = boardDTO.getBno();
     * Pattern paraPattern = Pattern.compile(
     * "(<(p|a|img|video|span|br).*?>[^<>]*?)+(</(p|a|img|video|span|br)>)*");
     * Pattern levelPattern =
     * Pattern.compile("(<(p|a|img|video|span|br).*?>)+.*?</"); // 임시
     * Pattern contentPattern = Pattern
     * .compile(
     * "(<(p|a|img|video|span|br).*?>[^<>]*(?=<))|(<(p|a|img|video|span|br).*?/>)");
     * // 임시
     * Pattern tagPattern = Pattern.compile("(?<=<)(p|a|img|video|span|br)");
     * Pattern stylePattern = Pattern.compile("(?<=style=\").*?(?=\")");
     * Pattern urlPattern = Pattern.compile("(?<=((src|href)=\")).*?(?=\")");
     * Pattern textPattern = Pattern.compile("(?<=>).+");
     * 
     * Matcher paraMatcher = paraPattern.matcher(boardDTO.getContent());
     * ArrayList<ContentDTO> contentList = new ArrayList<ContentDTO>();
     * while (paraMatcher.find()) {
     * System.out.println("para " + seq + ": " + paraMatcher.group());
     * Matcher contentMatcher = contentPattern.matcher(paraMatcher.group());
     * while (contentMatcher.find()) {
     * System.out.println("content " + seq + "_" + dep + ": " +
     * contentMatcher.group());
     * String contentStr = contentMatcher.group();
     * String tag = strFilter(contentStr, tagPattern);
     * String style = strFilter(contentStr, stylePattern);
     * String url = strFilter(contentStr, urlPattern);
     * String text = strFilter(contentStr, textPattern);
     * System.out.println("text: " + text);
     * contentList.add(new ContentDTO(bno, seq, dep, text, tag, style, url));
     * }
     * }
     * return contentList;
     * }
     */

    @Override
    public void toSecretTitle(BoardDTO[] list, String id, String auth) {
        for (int i = 0; i < list.length; i++) {
            if (list[i].getPw() == null) { // 비밀글이 아닐때
                list[i].setPw(null);
            } else if (!list[i].getUser_id().equals(id) && !auth.equals("ROLE_ADMIN")) { // 비밀글이면서 글 작성자가 아니면서 관리자도 아닐 때
                list[i].setTitle("비밀글입니다."); // 나중에 다국어 지원 예정

                list[i].setPw("pw");
            } else // 비밀글이면서 글 작성자일 때
                list[i].setPw("pw");
        }
    }

    @Override
    public void encode(BoardDTO[] list, String auth) {

        for (int i = 0; i < list.length; i++) {
            if (list[i].getPw() != null) { // 비밀글일 때
                list[i].setPw("pw");
            }
            list[i].setUser_id(null);
        }
    }

    @Override
    public void encode(BoardDTO board, String user_id, String auth) {

        if (board.getUser_id().equals(user_id))
            board.setUser_id("id");
        else {
            board.setUser_id(null);
            if (board.getPw() != null) { // 비밀글일 때
                board.setPw("pw");
            }
        }
    }

    @Override
    public boolean checkPw(String pw) {
        String regExp = "^[a-z0-9]{6}$";
        return Pattern.matches(regExp, pw);
    }

    @Override
    public HttpStatus insertBoard(BoardDTO dto) {
        int btotal = 0;
        boolean isDuplicate = false;
        do {
            try {
                if (!isDuplicate)
                    btotal = subjectDAO.getBoardTotal(dto.getSid());
                dto.setS_bno(btotal);
                boardDAO.insertBoard(dto);
                subjectDAO.updateBoardTotal(new SubjectDTO(dto.getSid(), btotal + 1));
                isDuplicate = false;
            } catch (DuplicateKeyException e) {
                btotal++;
                isDuplicate = true;
            } catch (BindingException e) {
                return HttpStatus.BAD_REQUEST;
            }
        } while (isDuplicate);
        return HttpStatus.OK;
    }

    @Override
    public int getBNO(BoardDTO dto) {
        return boardDAO.getBNO(dto);
    }

    @Override
    public BoardDTO[] getBoardPage(int page, String sid) {
        int btotal = 0;
        try {
            btotal = subjectDAO.getBoardTotal(sid);
        } catch (Exception e) {
        }
        return boardDAO.getBoardPage(new BoardListParaDTO(page, sid, btotal));
    }

    @Override
    public BoardDTO getBoard(int bno) {
        return boardDAO.getBoard(bno);
    }

    @Override
    public void updateBoard(BoardDTO dto) {
        boardDAO.updateBoard(dto);
    }

    @Override
    public void updateView(int bno) {
        boardDAO.updateView(bno); // redis로 일정 조회수 혹은 시간 동안 캐싱했다가 한번에 update 쿼리 예정
    }

    @Override
    public void deleteBoard(int bno) {
        boardDAO.deleteBoard(bno);
    }

    @Override
    public void recommend(int bno) {
        boardDAO.updateRecommendNum(bno);
    }
}
