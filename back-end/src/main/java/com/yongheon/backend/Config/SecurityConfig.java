package com.yongheon.backend.Config;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.yongheon.backend.Security.JwtAuthenticationEntryPoint;
import com.yongheon.backend.Security.JwtAuthenticationFilter;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    private final JwtAuthenticationEntryPoint unauthorizedHandler;

    @Autowired
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .cors().configurationSource(corsConfigurationSource()) // (1)
                .and()
                .csrf() // (2)
                .disable()
                .exceptionHandling() // (3)
                .authenticationEntryPoint(unauthorizedHandler)
                .and()
                .sessionManagement() // (4)
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .authorizeRequests()
                .antMatchers("/ajax/login/**", "/ajax/register/**", "/ajax/auth/refresh", "/ajax/logout/**",
                        "/ajax/auth/email/verify/**", "/ajax/board/read", "/ajax/board/read-secret", "/ajax/board/list",
                        "/ajax/subject/all", "/ajax/subject/get")
                .permitAll()
                .antMatchers("/ajax/**")
                .authenticated();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.addAllowedOrigin("https://yongheonn.com");
        configuration.setAllowedMethods(Arrays.asList("HEAD", "GET", "POST", "OPTIONS", "PATCH"));
        configuration.addAllowedHeader("*");
        configuration.addExposedHeader("authorization");
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    // 비밀번호 암호화를 위한 Encoder 설정
    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}