package com.yongheon.backend.Web.Controller;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.regex.Pattern;

import javax.transaction.Transactional;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class RegisterControllerTest {
    @Test
    public void regExpTest() throws Exception {
        String id = "ab1-_";
        String regExp = "^[a-z0-9_-]{5,20}$";
        Boolean result = Pattern.matches(regExp, id);
        assertEquals(result, true);
    }
}