import redisClient from "../db/redisClient.js";

// 인증코드(OTP) 보안 정책
// - 무차별 대입(brute-force) 방지: 같은 이메일+용도에 대해 최대 시도 횟수 제한
// - 발송 남용(rate-limit) 방지: 재발송 사이에 최소 대기시간(쿨다운) 강제
export const OTP_MAX_ATTEMPTS = 5;
export const OTP_RESEND_COOLDOWN_SEC = 60;
// 시도 횟수 키의 TTL은 코드 유효시간(5분)과 동일하게 둔다.
const OTP_ATTEMPTS_TTL_SEC = 5 * 60;

const normalizeEmail = (email) => String(email || "").trim().toLowerCase();

const cooldownKey = (type, email) => `otp-cooldown:${type}:${normalizeEmail(email)}`;
const attemptsKey = (type, email) => `otp-attempts:${type}:${normalizeEmail(email)}`;

// 남은 쿨다운(초). 0이면 발송 가능.
export const getResendCooldownRemaining = async (type, email) => {
  const ttl = await redisClient.ttl(cooldownKey(type, email));
  return ttl > 0 ? ttl : 0;
};

// 발송 직후 호출하여 쿨다운 시작
export const startResendCooldown = async (
  type,
  email,
  seconds = OTP_RESEND_COOLDOWN_SEC
) => {
  await redisClient.set(cooldownKey(type, email), "1", { EX: seconds });
};

// 현재까지의 인증 실패 시도 횟수
export const getOtpAttempts = async (type, email) => {
  const value = await redisClient.get(attemptsKey(type, email));
  return value ? Number(value) : 0;
};

// 실패 시도 1회 증가 후 누적 횟수 반환
export const incrementOtpAttempts = async (type, email) => {
  const key = attemptsKey(type, email);
  const attempts = await redisClient.incr(key);
  if (attempts === 1) {
    await redisClient.expire(key, OTP_ATTEMPTS_TTL_SEC);
  }
  return attempts;
};

// 인증 성공 또는 새 코드 발송 시 시도 횟수 초기화
export const resetOtpAttempts = async (type, email) => {
  await redisClient.del(attemptsKey(type, email));
};
