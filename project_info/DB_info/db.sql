-- 부서 정보 테이블
CREATE TABLE Branch_info (
  branch_id INT AUTO_INCREMENT PRIMARY KEY COMMENT '부서 ID 번호 : 자동 부여',
  branch_name VARCHAR(50) NOT NULL COMMENT '부서이름',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '생성일자',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '변경일자'
) COMMENT '부서 정보 테이블';

-- 요일별 식당정보 테이블
CREATE TABLE Restaurant_assigned (
  weekday VARCHAR(20) PRIMARY KEY COMMENT '요일 정보: 월화수목금',
  restaurant_id VARCHAR(20) NOT NULL COMMENT '식당 ID',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '생성일자',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '변경일자',
  FOREIGN KEY (restaurant_id) REFERENCES Users(user_id) ON DELETE NO ACTION
) COMMENT '요일별 식당정보 테이블';


-- 사용자 기본 정보 테이블
CREATE TABLE Users (
  user_id VARCHAR(20) PRIMARY KEY COMMENT '아이디 : 행번 / 식당 : 식당전화번호',
  role_id VARCHAR(10) NOT NULL COMMENT '역할 0:관리자 1:사용자 2:식당',
  username VARCHAR(50) NOT NULL COMMENT '이름',
  phone_number VARCHAR(20) COMMENT '핸드폰 번호',
  branch_id VARCHAR(20) COMMENT '부서정보',
  email VARCHAR(100) UNIQUE NOT NULL COMMENT '신한메일 / 식당메일',
  password_hash VARCHAR(255) NOT NULL COMMENT 'hash 변환된 비밀 번호',
  confirm_yn VARCHAR(10) NOT NULL COMMENT '승인 여부 0:승인대기 1:승인 2:정지 9:강제해지',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '생성일자',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '변경일자',
  FOREIGN KEY (branch_id) REFERENCES Branch_info(branch_id) ON DELETE NO ACTION
) COMMENT '사용자 기본 정보 테이블';


CREATE TABLE UserProfiles (
  profile_id INT AUTO_INCREMENT PRIMARY KEY COMMENT '프로파일 ID',
  user_id VARCHAR(20) COMMENT '사용자 ID',
  birth_date DATE COMMENT '생년월일',
  address TEXT COMMENT '베트남 거주주소',
  profile_picture_url VARCHAR(255) COMMENT '프로필 사진 URL',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
) COMMENT '사용자 프로필 정보 테이블';


-- 사용자 활동 로그 테이블
CREATE TABLE UserActivities (
  activity_id INT AUTO_INCREMENT PRIMARY KEY COMMENT '활동 로그 시리얼 번호',
  user_id VARCHAR(20) COMMENT '이용자 ID',
  activity_type VARCHAR(50) COMMENT '활동 타입',
  activity_description TEXT COMMENT '활동 설명',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE NO ACTION
) COMMENT '사용자 활동 로그 테이블';



-- 음식 메뉴 항목 테이블
CREATE TABLE MenuItems (
  restaurant_id VARCHAR(20) NOT NULL COMMENT '식당 ID : users 에서부터 생성',
  restaurant_name VARCHAR(50) COMMENT '식당이름',
  item_id INT AUTO_INCREMENT COMMENT '식당 메뉴 번호',
  name VARCHAR(100) NOT NULL COMMENT '메뉴명',
  description TEXT COMMENT '메뉴 설명',
  price INT COMMENT '가격',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (restaurant_id, item_id),
  FOREIGN KEY (restaurant_id) REFERENCES Users(user_id) ON DELETE NO ACTION
) COMMENT '음식 메뉴 항목 테이블';


CREATE TABLE Orders (
  order_id INT AUTO_INCREMENT PRIMARY KEY,
  order_branch VARCHAR(20) COMMENT '나중에 부서별 확장성을 위해 놔둠',
  restaurant_id VARCHAR(20) NOT NULL COMMENT '식당 ID',
  order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '주문일자',
  total_amount INT NOT NULL COMMENT '주문 갯수',
  total_pay INT COMMENT '주문 금액',
  status VARCHAR(10) NOT NULL COMMENT '주문 완료 : 0, 주문 요청 대기 : 1',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (restaurant_id) REFERENCES Users(user_id) ON DELETE NO ACTION,
  FOREIGN KEY (order_branch) REFERENCES Branch_info(branch_id) ON DELETE NO ACTION
) COMMENT '주문 기본 정보 테이블';


CREATE TABLE OrderItems (
  order_item_id VARCHAR(100) PRIMARY KEY COMMENT '주문번호 : 주문일자 + 부서번호 + 아이디번호 + 식당번호 + 메뉴번호',
  order_id INT NOT NULL COMMENT '주문 번호',
  user_id VARCHAR(20) COMMENT '이용자 ID',
  order_branch VARCHAR(20) COMMENT '부서번호',
  restaurant_id VARCHAR(20) NOT NULL COMMENT '식당 ID',
  item_id INT NOT NULL,
  quantity INT COMMENT '갯수인데 확장성 위해 보류',
  price INT COMMENT '가격처리 확장성 위해 보류',
  cancel_yn VARCHAR(10) COMMENT '주문 취소 여부 취소 0 재주문 1',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES Orders(order_id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES Orders(order_id) ON DELETE NO ACTION,
  FOREIGN KEY (restaurant_id) REFERENCES MenuItems(restaurant_id) ON DELETE NO ACTION,
  FOREIGN KEY (item_id) REFERENCES MenuItems(item_id) ON DELETE NO ACTION,
  FOREIGN KEY (order_branch) REFERENCES Branch_info(branch_id) ON DELETE NO ACTION
) COMMENT '주문 항목 테이블';

