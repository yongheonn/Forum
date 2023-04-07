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

@SpringBootTest
@AutoConfigureMockMvc
public class MainControllerTest {
	@Autowired
	private MockMvc mvc;

	@Test
	void testSendAccount() throws Exception {
		HttpHeaders tokenHeaders = new HttpHeaders();
		tokenHeaders.add("Authorization",
				"eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZW1waWQxMjMiLCJpYXQiOjE2NTY4NjQ3MzQsImV4cCI6MTY1NzQ2OTUzNH0.yd0IGP_EDpIpwGUnH9vIFGd_-DzaaBFr1qbc0Lh8sl9ZBukEGCFTRvAUWLeiTYE8XFHzOB0GRBtCOFAmhN6rfA");
		tokenHeaders.add("Accept", "application/json");
		tokenHeaders.add("Content-Type", "application/json");

		mvc.perform(MockMvcRequestBuilders.post("/ajax/main/account").headers(tokenHeaders))
				.andExpect(MockMvcResultMatchers.status().isOk())
				.andDo(MockMvcResultHandlers.print());

		HttpHeaders nonTokenHeaders = new HttpHeaders();
		nonTokenHeaders.add("Authorization", "");
		nonTokenHeaders.add("Accept", "application/json");
		nonTokenHeaders.add("Content-Type", "application/json");

		mvc.perform(MockMvcRequestBuilders.post("/ajax/main/account").headers(nonTokenHeaders))
				.andExpect(MockMvcResultMatchers.status().isUnauthorized())
				.andDo(MockMvcResultHandlers.print());
	}
}
