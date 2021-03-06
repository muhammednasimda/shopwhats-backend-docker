const express = require("express");
const router = express.Router();

const sequelize = require("../../dbconnection");
const initModels = require("../../models/init-models");
const models = initModels(sequelize);
const Sequilize = require("sequelize");
const Op = Sequilize.Op;

router.get("/:store", async (req, res) => {
  const storeinfo = await models.account.findOne({
    where: { account_store_link: req.params.store },
  });

  //no store by that url
  if (!storeinfo)
    return res.status(404).json({ status: false, error: "User Doesnt Exist" });

  const categories = await models.categories.findAll({
    where: { cat_user: storeinfo.id },
  });
  const products = await models.products.findAll({
    where: { product_user: storeinfo.id, product_stock: { [Op.ne]: 0 } },
    include: [
      {
        model: models.products_images,
        as: "products_images",
      },
    ],
  });
  return res.status(200).json({
    status: true,
    data: {
      storeinfo,
      categories,
      products,
    },
  });
});

module.exports = router;
