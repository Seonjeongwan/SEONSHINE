const { commonDb } = require("../db/connection");

exports.addBranch = (req, res) => {
  const { branch_name } = req.body;

  if (!branch_name) {
    return res.status(400).send({ message: "Branch name is required" });
  }

  const query =
    "INSERT INTO branch_info (branch_name, created_at, updated_at) VALUES (?, NOW(), NOW())";
  commonDb.query(query, [branch_name], (err, result) => {
    if (err) {
      res.status(500).send({ message: "Database error", error: err });
    } else {
      res.status(200).send({
        message: "Branch added successfully",
        branchId: result.insertId,
      });
    }
  });
};