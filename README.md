# 🛍️ 쇼핑몰 프로젝트

React + Node.js 기반 풀스택 쇼핑몰 프로젝트입니다.  
JWT 인증 기반 로그인, 상품 구매, 찜하기, 후기 작성 등 전자상거래의 기본 기능을 구현하였으며,  
AWS를 통한 배포와 GitHub Actions 기반 CI/CD 자동화를 구축하였습니다.

<br/>

## :rocket: 테스트 어드민 계정

- ID: admin@test.com
- PW: 123456


## 🚀 배포 주소

- **프론트엔드**: [https://my-shop.shop/](https://my-shop.shop/)
- **백엔드 API**: [https://my-shop.shop/api](https://my-shop.shop/api)

---

<br/>

### 🧑‍💼 사용자 기능

- ✅ JWT 기반 로그인 및 회원 인증
- ✅ 상품 목록 조회 (무한스크롤, 페이지네이션)
- ✅ 상품 상세 보기
- ✅ 장바구니 기능
- ✅ 찜하기 기능 (좋아요)
- ✅ 아임포트를 이용한 실제 결제 기능 (테스트 결제 연동)
- ✅ 후기(리뷰) 작성 / 수정 / 삭제 (CRUD)


### 🛠️ 관리자(어드민) 기능

- ✅ 상품 및 상품 옵션 등록 / 수정 / 삭제 (CRUD)
- ✅ 카테고리 관리 (CRUD)
- ✅ 상품/주문 데이터 관리
- ✅ Antd chart 이용한 매출 조회
  

<br/>

## 🚀 기술 스택
### 💻 프론트엔드
<p> <img src="https://img.shields.io/badge/React.js-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" /> <img src="https://img.shields.io/badge/Redux_Toolkit-593D88?style=for-the-badge&logo=redux&logoColor=white" /> <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" /> <img src="https://img.shields.io/badge/Ant_Design-0170FE?style=for-the-badge&logo=ant-design&logoColor=white" /> <img src="https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white" /> <img src="https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white" /> </p>

### 🌐 백엔드
<p> <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" /> <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" /> <img src="https://img.shields.io/badge/JWT_Auth-000000?style=for-the-badge&logo=jsonwebtoken&logoColor=white" /> <img src="https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=sequelize&logoColor=white" /> <img src="https://img.shields.io/badge/MySQL-00758F?style=for-the-badge&logo=mysql&logoColor=white" /> </p>

### ☁️ 인프라 & 배포
<p> <img src="https://img.shields.io/badge/AWS_EC2-FF9900?style=for-the-badge&logo=amazon-aws&logoColor=white" /> <img src="https://img.shields.io/badge/AWS_S3-569A31?style=for-the-badge&logo=amazon-s3&logoColor=white" /> <img src="https://img.shields.io/badge/AWS_RDS-527FFF?style=for-the-badge&logo=amazon-rds&logoColor=white" /> <img src="https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white" /> <img src="https://img.shields.io/badge/Nginx_SSL-009639?style=for-the-badge&logo=nginx&logoColor=white" /> <img src="https://img.shields.io/badge/Certbot-3C9CD7?style=for-the-badge&logo=letsencrypt&logoColor=white" /> </p>

<br/>

### 💻 프론트엔드

- **React.js**
- **Redux Toolkit** – 상태 관리
- **Tailwind CSS**, **Ant Design** – UI 구성
- **React Router** – 라우팅
- **Axios** – API 통신
- **Infinite Scroll** – 무한 스크롤 구현

### 🌐 백엔드

- **Node.js**
- **Express**
- **JWT** – 인증 및 토큰 관리
- **MySQL** – 데이터베이스
- **Sequelize** – ORM

### ☁️ 인프라 & 배포

- **AWS EC2** – 백엔드 서버 호스팅
- **AWS S3** – 상품 및 프로필 이미지 저장
- **AWS RDS (MySQL)** – 데이터베이스 관리
- **GitHub Actions** – CI/CD 자동화
- **Certbot + Nginx** – HTTPS 적용
<br/>



### 🗃️ 데이터베이스 ERD

<img width="1891" alt="img" src="https://github.com/user-attachments/assets/9384ed55-db6f-443d-b399-da43be5c4f2f" />
<br/>

### 🧱 서비스 아키텍처

<img width="1086" alt="shop_service_architecture" src="https://github.com/user-attachments/assets/f0af1f8d-ebd4-4297-adfc-00e46bcb5c47" />
<br/>
<br/>

---

## 📸 미리보기

- 메인 페이지

> 상품 목록과 카테고리, 상단 헤더 및 로그인/회원가입 등이 포함된 메인 홈 화면입니다.
<!--
<img width="300" alt="Image" src="https://github.com/user-attachments/assets/8f76e09a-5a69-4c4f-9086-73f0158dfda5" />
-->
<img width="400" alt="gif" src="https://github.com/user-attachments/assets/d47b0959-639a-46fe-a802-bedb9a0319d2" />

<br/>
<br/>
<br/>
<br/>

---

-  상품 상세 페이지
  
> 개별 상품 정보 확인, 수량 선택, 장바구니 및 찜하기 버튼이 포함된 상세 페이지입니다.
<!--
<img width="300" height="1324" alt="detail" src="https://github.com/user-attachments/assets/9351d3e6-b372-4c13-8eb9-abb0d8e37a31" />
-->
<img width="400" alt="gif" src="https://github.com/user-attachments/assets/39fcb074-55c7-4c48-89d4-8d66a06a0648" />

<br/>
<br/>
<br/>
<br/>

---

-  상품 리뷰 슬라이드
  
> 유저가 작성한 리뷰 사진들과 남긴 정보들을 슬라이드로 확인하는 페이지입니다.

<img width="650" alt="gif" src="https://github.com/user-attachments/assets/e148afef-2a05-431c-89f1-e6d5e89618a9" />

<br/>
<br/>
<br/>
<br/>

---

-  상품 리뷰 모아보기
  
<img width="650" alt="gif" src="https://github.com/user-attachments/assets/86c7d68c-7c89-4784-a1e8-5fd7afbfc529" />


<br/>
<br/>
<br/>
<br/>

---

-  상품 검색
  
<img alt="gif" width="400" src="https://github.com/user-attachments/assets/cd89b4d4-98f4-47e1-9e1b-9a49c2c69195" />


<br/>
<br/>
<br/>
<br/>

---

-  상품 좋아요 기능
> 선호하는 상품을 좋아요 리스트에 추가하거나 삭제합니다.
  
<img alt="gif" width="400" src="https://github.com/user-attachments/assets/63eb73da-7b73-4c4f-ab37-893e4f74b8c9" />

<br/>
<br/>
<br/>
<br/>

---

-  주문 리스트 조회 및 환불
  
<img alt="gif" width="400" src="https://github.com/user-attachments/assets/90ac3a67-a222-4544-9924-40f09e84bdb8" />

<br/>
<br/>
<br/>
<br/>

---

-  상품 리뷰 작성
> 주문한 제품의 리뷰를 작성합니다. (별점 제출만 필수 항목입니다.)
 
<img alt="gif" width="400" src="https://github.com/user-attachments/assets/c53d301e-afe2-4938-8303-1a448e18b202" />

<br/>
<br/>
<br/>
<br/>

---

-  쇼핑몰 포인트 조회
> 자신이 보유한 포인트를 조회합니다. (포인트는 상품 구매 시 사용 가능)
 
<img alt="png" width="400" src="https://github.com/user-attachments/assets/83b16821-879b-45a8-8bb6-0568900b05a7" />

<br/>
<br/>
<br/>
<br/>

---

-  상품 구매
> 원하는 상품을 바로 혹은 장바구니 추가된 상품을 선택해 구매합니다. (카카오페이 및 이니시스 테스트 구현)
 
<img alt="gif" width="400" src="https://github.com/user-attachments/assets/4f986f03-3b92-4e3d-9b6e-017a303183dd" />

<br/>
<br/>
<br/>
<br/>

---

-  어드민_ 대시보드
> 쇼핑몰 매출 현황을 그래프나 수치로 확인 가능합니다.
 
<img alt="gif" width="700" src="https://github.com/user-attachments/assets/dbe3aac9-d6a5-4ee1-b747-c10cd4e9e352" />

<br/>
<br/>
<br/>
<br/>

---

-  어드민_ 카테고리 조정
> 쇼핑몰 상품의 카테고리 메뉴들의 사진과 이름을 수정 및 삭제 가능합니다.
 
<img alt="gif" width="700" src="https://github.com/user-attachments/assets/f5f9b458-f112-4598-b0ff-907f5e18027b" />

<br/>
<br/>
<br/>
<br/>

---

-  어드민_ 상품 업로드
 
<img alt="gif" width="700" src="https://github.com/user-attachments/assets/588523c1-d3c3-4752-a1a5-cb5e458161c6" />

<br/>
<br/>
<br/>
<br/>

---

-  어드민_ 상품 옵션 조정
> 등록된 상품의 세부적인 옵션(사이즈, 색상, 가격)을 생성, 조회, 수정 및 삭제합니다. <br/>

> 색상, 사이즈 빈 값으로 둘 시 "옵션 없는 상품"이 됩니다.

<img alt="gif" width="700" src="https://github.com/user-attachments/assets/648380d2-345d-493a-8f3e-4eea47149cb8" />

<br/>
<br/>
<br/>
<br/>

---

-  어드민_ 유저 관리
> 쇼핑몰 가입된 유저 정보를 확인하고 포인트 송수신 및 부적절한 리뷰를 삭제 할 수 있습니다.

<img alt="gif" width="700" src="https://github.com/user-attachments/assets/b2373b10-ef6f-43af-ac4b-97b04efab511" />

<br/>

