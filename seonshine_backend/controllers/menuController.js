import { httpStatusCodes, httpStatusErrors } from "../constants/http.js";
import MenuItem from "../models/MenuItemModel.js";
import Upload from "../models/uploadModel.js";
import { requestUploadFile } from "../utils/file.js";

export const getMenuList = async (req, res) => {
  try {
    const { restaurant_id } = req.query;
    const menuItems = await MenuItem.findAll({
      attributes: ["item_id", "name", "description", "price", "image_url"],
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

//TODO: Check restaurant cannot create menu for other restaurant. Admin can add for all but current restaurant just for this.

export const createMenuItem = async (req, res) => {
  try {
    const file = req.file;
    const { name, restaurant_id } = req.body;

    let itemImagePath = null;

    if (file) {
      const fileResponse = await requestUploadFile(file);

      if (fileResponse) {
        const { originalname, mimetype, filename, path, size } = fileResponse;
        const upload = {
          original_name: originalname,
          type: mimetype,
          filename,
          full_path: path,
          size,
        };

        await Upload.create(upload);

        itemImagePath = path;
        console.log("path :>> ", path);
      }
    }

    const menuItem = {
      restaurant_id,
      name,
      image_url: itemImagePath,
    };

    const itemCreated = await MenuItem.create(menuItem);

    return res.status(httpStatusCodes.success).json({
      message: "Create successfully",
      item: itemCreated,
    });
  } catch (error) {
    console.log("error :>> ", error);
    res
      .status(httpStatusCodes.internalServerError)
      .send(httpStatusErrors.internalServerError);
  }
};

export const deleteMenuItem = async (req, res) => {
  try {
    const id = req.params.id;
    const menuItem = await MenuItem.findOne({
      where: {
        item_id: id,
      },
    });

    if (!menuItem) {
      return res.status(httpStatusCodes.notFound).json({
        message: "Menu item not found",
      });
    }

    await menuItem.destroy();

    return res.status(httpStatusCodes.success).json({
      message: "Delete successfully",
    });
  } catch (error) {
    console.log("error :>> ", error);
    res
      .status(httpStatusCodes.internalServerError)
      .send(httpStatusErrors.internalServerError);
  }
};

export const updateMenuItem = async (req, res) => {
  try {
    const file = req.file;
    const { id } = req.params;
    const { name } = req.body;

    const menuItem = await MenuItem.findByPk(id);

    if (!menuItem) {
      return res.status(httpStatusCodes.notFound).json({
        message: "Menu item not found",
      });
    }

    let itemImagePath = null;

    if (file) {
      const fileResponse = await requestUploadFile(file);

      if (fileResponse) {
        const { originalname, mimetype, filename, path, size } = fileResponse;
        const upload = {
          original_name: originalname,
          type: mimetype,
          filename,
          full_path: path,
          size,
        };

        await Upload.create(upload);

        itemImagePath = path;
      }
    }

    const menuUpdated = {
      name,
    };

    if (itemImagePath) {
      menuUpdated.image_url = itemImagePath;
    }

    const itemResponse = await menuItem.update(menuUpdated);

    return res.status(httpStatusCodes.success).json({
      message: "Update successfully",
      item: itemResponse,
    });
  } catch (error) {
    console.log("error :>> ", error);
    res
      .status(httpStatusCodes.internalServerError)
      .send(httpStatusErrors.internalServerError);
  }
};
