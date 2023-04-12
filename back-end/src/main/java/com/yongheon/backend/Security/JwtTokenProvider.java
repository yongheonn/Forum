package com.yongheon.backend.Security;

import java.util.Calendar;
import java.util.Date;

import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.SignatureException;
import io.jsonwebtoken.UnsupportedJwtException;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class JwtTokenProvider {
    private static final String ACCESS_KEY = "access_fjwaeadfsdfadfoif;";
    private static final String REFRESH_KEY = "refresh_fjwaeadfsdfadfoif";

    public enum TokenStatus {
        VALID, INVALID, EMPTY, EXPIRED
    }

    // access 토큰 생성
    public String generateAccessToken(String id, String auth) {

        Date now = new Date();
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(now);
        calendar.add(Calendar.MINUTE, 30);
        Date expiryDate = calendar.getTime();

        Claims claims = Jwts.claims();
        claims.put("id", id);
        claims.put("auth", auth);

        return Jwts.builder()
                .setClaims(claims) // 사용자
                .setIssuedAt(new Date()) // 현재 시간 기반으로 생성
                .setExpiration(expiryDate) // 만료 시간 세팅
                .signWith(SignatureAlgorithm.HS512, ACCESS_KEY) // 사용할 암호화 알고리즘, signature에 들어갈 secret 값 세팅
                .compact();
    }

    // access 토큰 재생성
    public String regenerateAccessToken(String token) {

        Date now = new Date();
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(now);
        calendar.add(Calendar.MINUTE, 30);
        Date expiryDate = calendar.getTime();

        Claims claims = parseAccessClaims(token);

        return Jwts.builder()
                .setClaims(claims) // 사용자
                .setIssuedAt(new Date()) // 현재 시간 기반으로 생성
                .setExpiration(expiryDate) // 만료 시간 세팅
                .signWith(SignatureAlgorithm.HS512, ACCESS_KEY) // 사용할 암호화 알고리즘, signature에 들어갈 secret 값 세팅
                .compact();
    }

    // refresh 토큰 생성
    public String generateRefreshToken(String id, String ip) {

        Date now = new Date();
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(now);
        calendar.add(Calendar.MONTH, 3);
        Date expiryDate = calendar.getTime();

        Claims claims = Jwts.claims();
        claims.put("id", id);
        claims.put("ip", ip);

        return Jwts.builder()
                .setClaims(claims) // 사용자
                .setIssuedAt(new Date()) // 현재 시간 기반으로 생성
                .setExpiration(expiryDate) // 만료 시간 세팅
                .signWith(SignatureAlgorithm.HS512, REFRESH_KEY) // 사용할 암호화 알고리즘, signature에 들어갈 secret 값 세팅
                .compact();
    }

    private Claims parseAccessClaims(String accessToken) {
        try {
            return Jwts.parser().setSigningKey(ACCESS_KEY).parseClaimsJws(accessToken).getBody();
        } catch (ExpiredJwtException e) {
            return e.getClaims();
        }
    }

    // 액세스 토큰에서 아이디 추출
    public String getIdFromAccessToken(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(ACCESS_KEY)
                .parseClaimsJws(token)
                .getBody();

        return (String) claims.get("id");
    }

    // 액세스 토큰에서 권한 추출
    public String getAuthFromAccessToken(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(ACCESS_KEY)
                .parseClaimsJws(token)
                .getBody();

        return (String) claims.get("auth");
    }

    // 리프레시 토큰에서 아이디 추출
    public String getIdFromRefreshToken(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(REFRESH_KEY)
                .parseClaimsJws(token)
                .getBody();

        return (String) claims.get("id");
    }

    // 리프레시 토큰에서 ip 추출
    public String getIpFromRefreshToken(String token) throws ExpiredJwtException {
        Claims claims = Jwts.parser()
                .setSigningKey(REFRESH_KEY)
                .parseClaimsJws(token)
                .getBody();

        return (String) claims.get("ip");
    }

    // access 토큰 유효성 검사
    public TokenStatus validateAccessToken(String token) {
        try {
            Jwts.parser().setSigningKey(ACCESS_KEY).parseClaimsJws(token);
            return TokenStatus.VALID;
        } catch (SignatureException ex) {
            log.error("Invalid JWT signature");
            return TokenStatus.INVALID;
        } catch (MalformedJwtException ex) {
            log.error("Invalid JWT token");
            return TokenStatus.INVALID;
        } catch (ExpiredJwtException ex) {
            log.error("Expired JWT token");
            return TokenStatus.EXPIRED;
        } catch (UnsupportedJwtException ex) {
            log.error("Unsupported JWT token");
            return TokenStatus.INVALID;
        } catch (IllegalArgumentException ex) {
            log.error("JWT claims string is empty.");
            return TokenStatus.EMPTY;
        }
    }

    public TokenStatus validateRefreshToken(String token, String clientIp) {
        try {
            String tokenIp = getIpFromRefreshToken(token);
            if (tokenIp.equals(clientIp))
                return TokenStatus.VALID;
            log.error("ip conflict client ip: " + clientIp + " tokenIp: " + tokenIp);
            return TokenStatus.INVALID;

        } catch (SignatureException ex) {
            log.error("Invalid Refresh signature");
            return TokenStatus.INVALID;
        } catch (MalformedJwtException ex) {
            log.error("Invalid Refresh token");
            return TokenStatus.INVALID;
        } catch (ExpiredJwtException ex) {
            log.error("Expired Refresh token");
            return TokenStatus.EXPIRED;
        } catch (UnsupportedJwtException ex) {
            log.error("Unsupported Refresh token");
            return TokenStatus.INVALID;
        } catch (IllegalArgumentException ex) {
            log.error("Refresh claims string is empty.");
            return TokenStatus.EMPTY;
        }

    }

}
