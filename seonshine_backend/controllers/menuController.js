import { httpStatusCodes, httpStatusErrors } from "../constants/http.js";
import MenuItem from "../models/MenuItemModel.js";

export const getMenuList = async (req, res) => {
  try {
    const { restaurant_id } = req.query;
    const menuItems = await MenuItem.findAll({
      attributes: ["item_id", "name", "description", "price"],
      where: {
        restaurant_id,
      },
    });
    res.status(httpStatusCodes.success).send(menuItems);
  } catch (error) {
    res
      .status(httpStatusCodes.internalServerError)
      .send(httpStatusErrors.internalServerError);
  }
};
