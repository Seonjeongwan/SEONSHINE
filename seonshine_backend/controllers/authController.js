
export const requestCode = async (email, type) => {
  // const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6자리 숫자 생성
  // const isSuccess = await sendVerificationCode(email, code);
  // return isSuccess;
  // userDb.query(
  //   "INSERT INTO user_db.verification (email, code, created_at,expiration) VALUES (?, ?, NOW(), ?)",
  //   [email, code, expiration],
  //   (err, result) => {
  //     if (err)
  //       return res.status(500).send({ message: "Database insert error" });

  // const isSuccess = await sendVerificationCode(email, code, async (error, result) => {
  //   if (error) {
  //     return res.status(500).send({ message: "Email sending error. Please try again" });
  //   }
  //   await saveToTemporaryDb(`${type}:${email}`, code, 3000); // 5 minutes
  //   res
  //     .status(200)
  //     .send({ message: "인증번호가 전송되었습니다.", status: 200 });
  // });
  // }
  // );
};

// exports.verifyCode = (req, res) => {
//   const { email, code } = req.body;

//   userDb.query(
//     "SELECT * FROM user_db.verification WHERE email = ? ORDER BY created_at DESC LIMIT 1",
//     [email],
//     (err, results) => {
//       if (err) return res.status(500).send({ message: "Database error" });
//       if (results.length === 0 || results[0].code !== code)
//         return res.send({ success: false, status: 401 });

//       const record = results[0];
//       const currentTime = Date.now();

//       if (currentTime > record.expiration) {
//         return res.send({
//           success: false,
//           status: 401,
//         });
//       }

//       res.send({ success: true, status: 200 });
//     }
//   );
// };
