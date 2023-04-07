package com.yongheon.backend.Web.Controller;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.ArrayList;

import javax.inject.Inject;
import javax.transaction.Transactional;

import org.apache.commons.lang3.time.StopWatch;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import com.yongheon.backend.Web.DTO.BoardDTO;
import com.yongheon.backend.Web.DTO.BoardListParaDTO;
import com.yongheon.backend.Web.Service.BoardService;
import com.yongheon.backend.Web.Service.SubjectService;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class BoardControllerTest {

    @Test
    public void getBoardList() throws Exception {

    }
}
