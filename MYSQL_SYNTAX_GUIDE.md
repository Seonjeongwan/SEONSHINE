# MySQL 문법 가이드

## 📚 기본 문법

### 1. 데이터베이스 관리

```sql
-- 데이터베이스 생성
CREATE DATABASE database_name;

-- 데이터베이스 선택
USE database_name;

-- 데이터베이스 목록 확인
SHOW DATABASES;

-- 데이터베이스 삭제
DROP DATABASE database_name;
```

### 2. 테이블 관리

#### 테이블 생성

```sql
CREATE TABLE table_name (
    column1 datatype constraints,
    column2 datatype constraints,
    PRIMARY KEY (column1),
    FOREIGN KEY (column2) REFERENCES other_table(column)
) COMMENT '테이블 설명';
```

**예시 (프로젝트에서 사용)**:

```sql
CREATE TABLE menu_items (
    item_id INT AUTO_INCREMENT PRIMARY KEY COMMENT '식당 메뉴 번호',
    restaurant_id VARCHAR(20) NOT NULL COMMENT '식당 ID',
    name VARCHAR(100) NOT NULL COMMENT '메뉴명',
    price INT COMMENT '가격',
    is_deleted TINYINT(1) DEFAULT 0 NOT NULL COMMENT '메뉴 삭제 여부 0:정상 1:삭제됨',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (restaurant_id) REFERENCES user_db.users(user_id) ON DELETE NO ACTION
) COMMENT '음식 메뉴 항목 테이블';
```

#### 테이블 구조 확인

```sql
-- 테이블 구조 확인
DESCRIBE table_name;
-- 또는
DESC table_name;
-- 또는
SHOW COLUMNS FROM table_name;
```

#### 테이블 수정

```sql
-- 컬럼 추가
ALTER TABLE table_name
ADD COLUMN column_name datatype constraints AFTER existing_column;

-- 컬럼 수정
ALTER TABLE table_name
MODIFY COLUMN column_name new_datatype;

-- 컬럼 삭제
ALTER TABLE table_name
DROP COLUMN column_name;

-- 컬럼 이름 변경
ALTER TABLE table_name
CHANGE COLUMN old_name new_name datatype;
```

**예시 (프로젝트에서 사용한 패턴)**:

```sql
-- is_deleted 컬럼 추가
ALTER TABLE menu_items
ADD COLUMN is_deleted TINYINT(1) DEFAULT 0 NOT NULL COMMENT '메뉴 삭제 여부 0:정상 1:삭제됨'
AFTER price;
```

#### 테이블 삭제

```sql
DROP TABLE table_name;
```

### 3. 데이터 조회 (SELECT)

```sql
-- 기본 조회
SELECT * FROM table_name;

-- 특정 컬럼만 조회
SELECT column1, column2 FROM table_name;

-- 조건부 조회
SELECT * FROM table_name WHERE condition;

-- 정렬
SELECT * FROM table_name ORDER BY column_name ASC;  -- 오름차순
SELECT * FROM table_name ORDER BY column_name DESC; -- 내림차순

-- 제한
SELECT * FROM table_name LIMIT 10;

-- 그룹화
SELECT column, COUNT(*) FROM table_name GROUP BY column;
```

**예시 (프로젝트에서 사용)**:

```sql
-- 삭제되지 않은 메뉴만 조회
SELECT * FROM menu_items WHERE is_deleted = 0;

-- 특정 식당의 메뉴 조회
SELECT * FROM menu_items
WHERE restaurant_id = 'restaurant001' AND is_deleted = 0;

-- 컬럼 구조 확인
DESCRIBE menu_items;
```

### 4. 데이터 삽입 (INSERT)

```sql
-- 모든 컬럼에 값 삽입
INSERT INTO table_name VALUES (value1, value2, ...);

-- 특정 컬럼에만 값 삽입
INSERT INTO table_name (column1, column2) VALUES (value1, value2);

-- 여러 행 삽입
INSERT INTO table_name (column1, column2)
VALUES (value1, value2), (value3, value4);
```

**예시**:

```sql
INSERT INTO menu_items (restaurant_id, name, price)
VALUES ('restaurant001', '김치찌개', 8000);
```

### 5. 데이터 수정 (UPDATE)

```sql
-- 단일 행 수정
UPDATE table_name
SET column1 = value1, column2 = value2
WHERE condition;

-- 여러 행 수정
UPDATE table_name
SET column = value
WHERE condition;
```

**예시 (프로젝트에서 사용)**:

```sql
-- 메뉴 삭제 (Soft delete)
UPDATE menu_items
SET is_deleted = 1
WHERE item_id = 123;

-- 여러 메뉴 삭제
UPDATE menu_items
SET is_deleted = 1
WHERE restaurant_id = 'restaurant001';
```

### 6. 데이터 삭제 (DELETE)

```sql
-- 조건에 맞는 행 삭제
DELETE FROM table_name WHERE condition;

-- 모든 데이터 삭제 (주의!)
DELETE FROM table_name;
```

**주의**: 프로젝트에서는 Soft Delete를 사용하므로 실제 DELETE는 사용하지 않습니다.

### 7. 조건문 (WHERE)

```sql
-- 기본 비교
WHERE column = value
WHERE column != value
WHERE column <> value
WHERE column > value
WHERE column < value
WHERE column >= value
WHERE column <= value

-- AND, OR
WHERE condition1 AND condition2
WHERE condition1 OR condition2

-- IN, NOT IN
WHERE column IN (value1, value2, value3)
WHERE column NOT IN (value1, value2)

-- LIKE (패턴 매칭)
WHERE column LIKE 'pattern%'  -- 시작
WHERE column LIKE '%pattern'  -- 끝
WHERE column LIKE '%pattern%' -- 포함

-- NULL 체크
WHERE column IS NULL
WHERE column IS NOT NULL

-- BETWEEN
WHERE column BETWEEN value1 AND value2
```

**예시 (프로젝트에서 사용)**:

```sql
-- 삭제되지 않은 메뉴 조회
SELECT * FROM menu_items WHERE is_deleted = 0;

-- 특정 식당의 삭제되지 않은 메뉴
SELECT * FROM menu_items
WHERE restaurant_id = 'restaurant001' AND is_deleted = 0;

-- NULL이 아닌 메뉴
SELECT * FROM menu_items WHERE name IS NOT NULL;
```

### 8. 조인 (JOIN)

```sql
-- INNER JOIN
SELECT * FROM table1
INNER JOIN table2 ON table1.id = table2.id;

-- LEFT JOIN
SELECT * FROM table1
LEFT JOIN table2 ON table1.id = table2.id;

-- RIGHT JOIN
SELECT * FROM table1
RIGHT JOIN table2 ON table1.id = table2.id;
```

**예시 (프로젝트에서 사용)**:

```sql
-- 주문 정보와 메뉴 정보 조인
SELECT o.*, m.name, m.price
FROM order_items o
JOIN menu_items m ON o.item_id = m.item_id
WHERE o.order_date = '2024-01-01';
```

### 9. 집계 함수

```sql
-- COUNT: 개수
SELECT COUNT(*) FROM table_name;
SELECT COUNT(column) FROM table_name;

-- SUM: 합계
SELECT SUM(column) FROM table_name;

-- AVG: 평균
SELECT AVG(column) FROM table_name;

-- MAX: 최대값
SELECT MAX(column) FROM table_name;

-- MIN: 최소값
SELECT MIN(column) FROM table_name;
```

**예시**:

```sql
-- 메뉴 개수
SELECT COUNT(*) FROM menu_items WHERE is_deleted = 0;

-- 식당별 메뉴 개수
SELECT restaurant_id, COUNT(*) as menu_count
FROM menu_items
WHERE is_deleted = 0
GROUP BY restaurant_id;
```

### 10. 제약조건 (Constraints)

```sql
-- PRIMARY KEY: 기본키
PRIMARY KEY (column)

-- FOREIGN KEY: 외래키
FOREIGN KEY (column) REFERENCES other_table(column) ON DELETE action

-- UNIQUE: 고유값
UNIQUE (column)

-- NOT NULL: NULL 불가
NOT NULL

-- DEFAULT: 기본값
DEFAULT value

-- AUTO_INCREMENT: 자동 증가
AUTO_INCREMENT
```

**ON DELETE 옵션**:

- `ON DELETE CASCADE`: 참조되는 행 삭제 시 함께 삭제
- `ON DELETE NO ACTION`: 삭제 방지 (프로젝트에서 주로 사용)
- `ON DELETE SET NULL`: NULL로 설정
- `ON DELETE RESTRICT`: 삭제 제한

**예시 (프로젝트에서 사용)**:

```sql
FOREIGN KEY (item_id) REFERENCES restaurant_db.menu_items(item_id) ON DELETE NO ACTION
```

### 11. 데이터 타입

#### 숫자 타입

```sql
INT              -- 정수
TINYINT(1)       -- 작은 정수 (0-255), BOOLEAN으로도 사용
BIGINT           -- 큰 정수
DECIMAL(10,2)    -- 소수점 (10자리, 소수점 2자리)
FLOAT            -- 부동소수점
```

#### 문자열 타입

```sql
VARCHAR(n)       -- 가변 길이 문자열 (최대 n자)
CHAR(n)          -- 고정 길이 문자열 (n자)
TEXT             -- 긴 텍스트
```

#### 날짜/시간 타입

```sql
DATE             -- 날짜 (YYYY-MM-DD)
TIME             -- 시간 (HH:MM:SS)
DATETIME         -- 날짜와 시간
TIMESTAMP        -- 타임스탬프 (자동 업데이트 가능)
```

**예시 (프로젝트에서 사용)**:

```sql
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
```

### 12. 인덱스

```sql
-- 인덱스 생성
CREATE INDEX index_name ON table_name (column);

-- 고유 인덱스
CREATE UNIQUE INDEX index_name ON table_name (column);

-- 인덱스 삭제
DROP INDEX index_name ON table_name;
```

### 13. 트랜잭션

```sql
-- 트랜잭션 시작
START TRANSACTION;

-- 커밋
COMMIT;

-- 롤백
ROLLBACK;
```

## 🔧 프로젝트에서 자주 사용하는 패턴

### 1. Soft Delete 조회

```sql
-- 삭제되지 않은 데이터만 조회
SELECT * FROM menu_items WHERE is_deleted = 0;

-- 삭제된 데이터만 조회
SELECT * FROM menu_items WHERE is_deleted = 1;
```

### 2. 외래키를 사용한 조인

```sql
-- 다른 데이터베이스의 테이블 참조
SELECT * FROM order_db.order_items o
JOIN restaurant_db.menu_items m ON o.item_id = m.item_id
WHERE m.is_deleted = 0;
```

### 3. 날짜/시간 처리

```sql
-- 현재 날짜
SELECT CURRENT_DATE;
SELECT CURDATE();

-- 현재 시간
SELECT CURRENT_TIME;
SELECT CURTIME();

-- 현재 날짜와 시간
SELECT NOW();
SELECT CURRENT_TIMESTAMP;
```

### 4. 조건부 업데이트

```sql
-- 특정 조건의 데이터만 업데이트
UPDATE menu_items
SET is_deleted = 1
WHERE item_id = 123 AND is_deleted = 0;
```

## 📝 유용한 명령어

```sql
-- 현재 데이터베이스 확인
SELECT DATABASE();

-- 테이블 목록 확인
SHOW TABLES;

-- 테이블 구조 확인
DESCRIBE table_name;

-- 인덱스 확인
SHOW INDEX FROM table_name;

-- 테이블 생성 SQL 확인
SHOW CREATE TABLE table_name;

-- 현재 사용자 확인
SELECT USER();

-- 버전 확인
SELECT VERSION();
```

## ⚠️ 주의사항

1. **WHERE 절 없이 UPDATE/DELETE 사용 금지**: 모든 데이터가 변경/삭제됨
2. **트랜잭션 사용**: 여러 쿼리를 실행할 때는 트랜잭션 사용 권장
3. **인덱스 활용**: 자주 조회하는 컬럼에는 인덱스 생성 고려
4. **외래키 제약조건**: `ON DELETE NO ACTION` 사용 시 삭제 전 참조 확인 필요

## 🎯 프로젝트 특화 예시

### 메뉴 관련 쿼리

```sql
-- 삭제되지 않은 메뉴 조회
SELECT item_id, name, price, image_url
FROM restaurant_db.menu_items
WHERE restaurant_id = 'restaurant001' AND is_deleted = 0;

-- 메뉴 삭제 (Soft delete)
UPDATE restaurant_db.menu_items
SET is_deleted = 1
WHERE item_id = 123;

-- 메뉴 복구
UPDATE restaurant_db.menu_items
SET is_deleted = 0
WHERE item_id = 123;
```

### 주문 관련 쿼리

```sql
-- 오늘 주문 내역 조회
SELECT * FROM order_db.order_items
WHERE order_date = CURDATE();

-- 특정 메뉴의 주문 내역 (삭제된 메뉴 포함)
SELECT o.*, m.name, m.is_deleted
FROM order_db.order_items o
JOIN restaurant_db.menu_items m ON o.item_id = m.item_id
WHERE o.order_date = '2024-01-01';
```


