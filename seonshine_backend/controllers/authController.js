const { userDb } = require("../db/connection");
const emailUtil = require("../utils/emailUtil");

exports.requestCode = (req, res) => {
  const { email } = req.body;
  const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6자리 숫자 생성
  const expiration = Date.now() + 5 * 60 * 1000; // 5 minutes

  userDb.query(
    "INSERT INTO user_db.verification (email, code, created_at,expiration) VALUES (?, ?, NOW(), ?)",
    [email, code, expiration],
    (err, result) => {
      if (err)
        return res.status(500).send({ message: "Database insert error" });

      emailUtil.sendVerificationCode(email, code, (error, result) => {
        if (error) {
          return res.status(500).send({ message: "Email sending error" });
        }
        res
          .status(200)
          .send({ message: "인증번호가 전송되었습니다.", status: 200 });
      });
    }
  );
};

exports.verifyCode = (req, res) => {
  const { email, code } = req.body;

  userDb.query(
    "SELECT * FROM user_db.verification WHERE email = ? ORDER BY created_at DESC LIMIT 1",
    [email],
    (err, results) => {
      if (err) return res.status(500).send({ message: "Database error" });
      if (results.length === 0 || results[0].code !== code)
        return res.send({ success: false, status: 401 });

      const record = results[0];
      const currentTime = Date.now();

      if (currentTime > record.expiration) {
        return res.send({
          success: false,
          status: 401,
        });
      }

      res.send({ success: true, status: 200 });
    }
  );
};
