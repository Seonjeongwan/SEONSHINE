-- 사용자 생성
CREATE USER 'seonshine_mgr'@'localhost' IDENTIFIED BY 'seonshine@2';

-- ALTER USER 'seonshine_mgr'@'%' IDENTIFIED WITH mysql_native_password BY 'seonshine@2';
-- FLUSH PRIVILEGES;

-- common database: common_db
CREATE DATABASE common_db;

USE common_db;

-- 부서 정보 테이블
CREATE TABLE branch_info (
  branch_id INT AUTO_INCREMENT PRIMARY KEY COMMENT '부서 ID 번호 : 자동 부여',
  branch_name VARCHAR(50) NOT NULL COMMENT '부서이름',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '생성일자',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '변경일자'
) COMMENT '부서 정보 테이블';

-- user database: user_db
CREATE DATABASE user_db;

USE user_db;

-- 사용자 기본 정보 테이블
CREATE TABLE users (
  user_id VARCHAR(20) PRIMARY KEY COMMENT '아이디 : 행번 / 식당 : 식당전화번호',
  role_id VARCHAR(10) NOT NULL COMMENT '역할 0:관리자 1:사용자 2:식당',
  username VARCHAR(50) NOT NULL COMMENT '이름',
  phone_number VARCHAR(20) COMMENT '핸드폰 번호',
  branch_id INT COMMENT '부서정보',
  email VARCHAR(100) UNIQUE NOT NULL COMMENT '신한메일 / 식당메일',
  password_hash VARCHAR(255) NOT NULL COMMENT 'hash 변환된 비밀 번호',
  user_status VARCHAR(10) NOT NULL COMMENT '승인 여부 0:승인대기 1:승인 2:정지 9:강제정지',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '생성일자',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '변경일자',
  FOREIGN KEY (branch_id) REFERENCES common_db.branch_info(branch_id) ON DELETE NO ACTION
) COMMENT '사용자 기본 정보 테이블';

-- 사용자 프로필 정보 테이블
CREATE TABLE user_profiles (
  profile_id INT AUTO_INCREMENT PRIMARY KEY COMMENT '프로파일 ID',
  user_id VARCHAR(20) COMMENT '사용자 ID',
  birth_date DATE COMMENT '생년월일',
  address TEXT COMMENT '베트남 거주주소',
  profile_picture_url VARCHAR(255) COMMENT '프로필 사진 URL',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) COMMENT '사용자 프로필 정보 테이블';

-- 이메일 인증 테이블
CREATE TABLE IF NOT EXISTS verification (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL COMMENT '인증 이메일',
    code VARCHAR(10) NOT NULL COMMENT '인증번호',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expiration BIGINT NOT NULL COMMENT '만료시간'
) COMMENT '이메일 인증 테이블';

-- 사용자 활동 로그 테이블
CREATE TABLE user_activities (
  activity_id INT AUTO_INCREMENT PRIMARY KEY COMMENT '활동 로그 시리얼 번호',
  user_id VARCHAR(20) COMMENT '이용자 ID',
  activity_type VARCHAR(50) COMMENT '활동 타입',
  activity_description TEXT COMMENT '활동 설명',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE NO ACTION
) COMMENT '사용자 활동 로그 테이블';

-- restaurant database: restaurant_db
CREATE DATABASE restaurant_db;

USE restaurant_db;

-- 요일별 식당정보 테이블
CREATE TABLE restaurant_assigned (
  weekday VARCHAR(20) PRIMARY KEY COMMENT '요일 정보: 월화수목금',
  restaurant_id VARCHAR(20) NOT NULL COMMENT '식당 ID',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '생성일자',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '변경일자',
  FOREIGN KEY (restaurant_id) REFERENCES user_db.users(user_id) ON DELETE NO ACTION
) COMMENT '요일별 식당정보 테이블';

-- 음식 메뉴 항목 테이블
CREATE TABLE menu_items (
  item_id INT AUTO_INCREMENT PRIMARY KEY COMMENT '식당 메뉴 번호',
  restaurant_id VARCHAR(20) NOT NULL COMMENT '식당 ID : users 에서부터 생성',
  restaurant_name VARCHAR(50) COMMENT '식당이름',
  name VARCHAR(100) NOT NULL COMMENT '메뉴명',
  description TEXT COMMENT '메뉴 설명',
  price INT COMMENT '가격',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE (restaurant_id, item_id),
  FOREIGN KEY (restaurant_id) REFERENCES user_db.users(user_id) ON DELETE NO ACTION
) COMMENT '음식 메뉴 항목 테이블';

-- order database: order_db
CREATE DATABASE order_db;

USE order_db;

-- 주문 기본 정보 테이블
CREATE TABLE order_history (
  order_id VARCHAR(100) COMMENT '주문 ID : 주문일자 + 부서번호 + 식당번호',
  branch_id INT COMMENT '나중에 부서별 확장성을 위해 놔둠',
  restaurant_id VARCHAR(20) NOT NULL COMMENT '식당 ID',
  order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '주문일자',
  total_amount INT NOT NULL COMMENT '주문 갯수',
  total_pay INT COMMENT '주문 금액',
  status VARCHAR(10) NOT NULL COMMENT '주문 완료 : 0, 주문 요청 대기 : 1',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (order_id),
  FOREIGN KEY (restaurant_id) REFERENCES user_db.users(user_id) ON DELETE NO ACTION,
  FOREIGN KEY (branch_id) REFERENCES common_db.branch_info(branch_id) ON DELETE NO ACTION
) COMMENT '주문 기본 정보 테이블';

-- 주문 항목 테이블
CREATE TABLE order_items (
  order_item_id VARCHAR(100) PRIMARY KEY COMMENT '주문 메뉴 ID : 주문일자 + 부서번호 + 아이디번호 + 식당번호 + 메뉴번호',
  order_id VARCHAR(100) NOT NULL COMMENT '주문 번호',
  user_id VARCHAR(20) COMMENT '이용자 ID',
  branch_id INT COMMENT '부서번호',
  restaurant_id VARCHAR(20) NOT NULL COMMENT '식당 ID',
  item_id INT NOT NULL,
  quantity INT COMMENT '갯수인데 확장성 위해 보류',
  price INT COMMENT '가격처리 확장성 위해 보류',
  cancel_yn VARCHAR(10) COMMENT '주문 취소 여부 취소 0 재주문 1',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES order_history(order_id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES user_db.users(user_id) ON DELETE NO ACTION,
  FOREIGN KEY (restaurant_id) REFERENCES user_db.users(user_id) ON DELETE NO ACTION,
  FOREIGN KEY (item_id) REFERENCES restaurant_db.menu_items(item_id) ON DELETE NO ACTION,
  FOREIGN KEY (branch_id) REFERENCES common_db.branch_info(branch_id) ON DELETE NO ACTION
) COMMENT '주문 항목 테이블';

-- 권한 부여
GRANT ALL PRIVILEGES ON common_db.* TO 'seonshine_mgr'@'localhost';
GRANT ALL PRIVILEGES ON user_db.* TO 'seonshine_mgr'@'localhost';
GRANT ALL PRIVILEGES ON restaurant_db.* TO 'seonshine_mgr'@'localhost';
GRANT ALL PRIVILEGES ON order_db.* TO 'seonshine_mgr'@'localhost';

-- 권한 적용
FLUSH PRIVILEGES;