const { items, orders } = require("../dataTest");
const { v4: uuidv4 } = require("uuid");

const handlePurchase = (req, res) => {
  const purchaseArray = req.body;
  let uuid = uuidv4();
  newOrderId = uuid.slice(0, 13);

  let newOrder = {};

  let error = false;
  purchaseArray.forEach((element) => {
    const [id] = Object.keys(element);
    const [quantity] = Object.values(element);

    items.forEach((element) => {
      if (element._id === Number(id)) {
        if (element.numInStock < quantity) {
          error = true;
          return;
        }
        element.numInStock -= quantity;
        newOrder[id] = quantity;
      }
    });
  });
  if (error) {
    //console.log("error true, early return");
    return res.status(400).send({
      error: `Not enough items in stock`,
    });
  }

  orders[newOrderId] = newOrder;
  const delay = Math.random() * 1250 + 500;
  setTimeout(() => {
    res.status(200).send({ status: "success", orderId: newOrderId });
  }, delay);
};

module.exports = {
  handlePurchase,
};
