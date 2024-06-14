import { httpStatusCodes, httpStatusErrors } from "../constants/http.js";
import Branch from "../models/branchModel.js";
import { getResponseErrors } from "../utils/responseParser.js";

export const getAllBranch = async (req, res) => {
  const branches = await Branch.findAll({
    attributes: { exclude: ["created_at", "updated_at"] },
  });
  res.status(httpStatusCodes.success).send(branches);
};

export const getBranchById = async (req, res) => {
  try {
    const branch = await Branch.findByPk(req.params.id, { raw: true });
    if (branch) {
      res.status(httpStatusCodes.success).json(branch);
    } else {
      res
        .status(httpStatusCodes.badRequest)
        .json({ error: "Branch not found" });
    }
  } catch (error) {
    res
      .status(httpStatusCodes.internalServerError)
      .json({ error: httpStatusErrors.internalServerError });
  }
};

export const addBranch = async (req, res) => {
  try {
    const branch = await Branch.create(req.body);
    res.status(httpStatusCodes.created).json(branch);
  } catch (error) {
    const response = getResponseErrors(error);
    res.status(response.status).json({ errors: response.errors });
  }
};
