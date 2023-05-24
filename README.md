## 결과물  

https://yongheonn.com  

## 기술 스택

### Front-End

- html, css, javascript
- React
- Typescript


### Back-End

- java
- Spring Boot
- Spring Secure
- Redis
- Mysql
- MyBatis
- smtp mail
- JWT
- OAuth 2.0


### Cloud

AWS
- ec2
- s3
- cloudfront
- lambda

Cloud Flare

## 프로젝트 소개

### - Front
ㄴ React를 활용한 SPA 구현  
ㄴ styled-component를 활용하여 더 뛰어난 디자인 유지보수 처리  
ㄴ Typescript를 통한 엄격한 타입 체크로 실수 발생 줄이기  

### - Backend  
ㄴ 중복 및 유효성 체크 (정규식 활용)  
ㄴ oauth 2.0을 통한 구글, 네이버, 카카오 로그인 - Spring Security의 Filter Chain을 활용하여 인증  
ㄴ JWT 리프레시 토큰과 액세스 토큰을 활용 - Spring Security의 Filter Chain을 활용하여 인증  
ㄴ smtp 이메일을 활용한 인증 처리  
ㄴ Redia를 활용한 인증 정보 처리  
  
ㄴ - RDBMS  
  ㄴ Mysql을 활용한 db 처리  
  ㄴ Mybatis를 활용한 코드와 쿼리 분리 및 유지보수 개선    
  ㄴ 적절한 index 활용을 통한 성능 개선  
    
### - Deploy & Cloud  
ㄴ - Git  
  ㄴ git을 활용한 코드 관리  
  ㄴ Submodule을 활용한 민감한 정보 처리  
  (이전 저장소에서 민감한 정보가 드러나 비공개로 전환하고 새로 만들 것이 Forum 저장소, 그렇기 때문에 부자연스러운 커밋 이력 발생)  
  ㄴ 자동 배포를 위한 github actions 활용  
  
ㄴ - Aws  
  ㄴ aws s3를 활용해 프론트와 백엔드 빌드 파일 저장  
  ㄴ aws ec2를 활용해 백엔드 서버 실행  
  ㄴ aws cloudfront를 활용해 프론트 정적 웹 배포, 전체적인 캐시 관리 및 ssh 인증서 활용  
  ㄴ aws lambda를 활용해 React 빌드 파일의 특성을 고려한 각 파일의 캐시 최적화 자동화, 그에 따른 트래픽 최소화  
  ㄴ 로컬 폰트 활용 및 icon 최적화로 트래픽 최적화(Front React)  
    
ㄴ - Cloud Flare  
  ㄴ 디도스 방어등 간략하게 보안 문제 해결  
    
### 기능 구현  
  ㄴ 회원가입 및 로그인  
  ㄴ 이메일 인증, 도메인 이메일 활용  
  ㄴ oauth 2.0을 통한 네이버, 구글, 카카오 로그인  
  ㄴ 게시판 작성, 수정, 삭제, 조회, 추천(추천 중복 확인)  
  ㄴ 비밀글 작성 및 유형 선택, 비밀번호 입력 커스텀화  
  ㄴ 게시판 주제(유형) 분류, 그에 따른 생성 및 삭제 추가  
  ㄴ 다국어 지원을 위한 한국어 및 영어 선택 기능(아직 일부만 처리)  
  ㄴ 권한 별로 다른 접근 수준  
  (ex: 로그인 여부, 이메일 인증 여부, 관리자 여부에 따라 다름, 관리자는 게시판 주제 생성, 삭제 가능)  
  

## 개발 고민

### 리프레시 토큰

https://yongheonn.github.io/posts/jwt_thinking_2/  
https://yongheonn.github.io/posts/jwt_thinking_3/  

### 캐시 최적화

https://yongheonn.github.io/posts/cache_setting/  

### mysql 인덱스 최적화

https://yongheonn.github.io/posts/db_thinking_1/  
https://yongheonn.github.io/posts/db_thinking_2/  

### 기타

https://yongheonn.github.io/posts/email_authentication/  
https://yongheonn.github.io/posts/board-secret/  
https://yongheonn.github.io/posts/spring_mail_error/  
https://yongheonn.github.io/posts/font-traffic/  
 
