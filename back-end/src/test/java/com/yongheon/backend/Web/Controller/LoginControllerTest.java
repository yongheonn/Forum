package com.yongheon.backend.Web.Controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class LoginControllerTest {
	@Autowired
    private MockMvc mvc;

    @Test
	public void login() throws Exception {
		String id = "abcdefgh1";
		String pw = "abcd1234";
		MultiValueMap<String, String> query_param = new LinkedMultiValueMap<>();
        query_param.add("id",id);
        query_param.add("pw", pw);
		HttpHeaders httpHeaders = new HttpHeaders();
		httpHeaders.add("Authorization", "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZW1waWQxMjMiLCJpYXQiOjE2NTY4NjQ3MzQsImV4cCI6MTY1NzQ2OTUzNH0.yd0IGP_EDpIpwGUnH9vIFGd_-DzaaBFr1qbc0Lh8sl9ZBukEGCFTRvAUWLeiTYE8XFHzOB0GRBtCOFAmhN6rfA");
		httpHeaders.add("Accept", "application/json");
		httpHeaders.add("Content-Type", "application/json");
		
		mvc.perform(MockMvcRequestBuilders.post("/ajax/login/")
		.headers(httpHeaders))
		.andExpect(MockMvcResultMatchers.status().is4xxClientError())
		.andDo(MockMvcResultHandlers.print());
	}
}
