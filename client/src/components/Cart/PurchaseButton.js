import React from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { COLORS } from "../../constants";
import { useHistory } from "react-router-dom";

import {
  purchaseCartItemsRequest,
  purchaseCartItemsReceive,
  purchaseCartItemsError,
  clearCart,
} from "../../actions";

const PurchaseButton = ({ cartItems }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const handlePurchase = (event) => {
    event.preventDefault();
    dispatch(purchaseCartItemsRequest());
    let arr = [];
    cartItems.forEach((item) => {
      arr.push({ [item._id]: item.quantity });
    });

    fetch("/buy", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(arr),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        dispatch(purchaseCartItemsReceive());
        history.push("/ConfirmationPage");
        // dispatch(clearCart());
      })
      .catch((error) => {
        console.error("Error:", error);
        dispatch(purchaseCartItemsError(error));
      });
  };

  return <CartButton onClick={handlePurchase}>purchase</CartButton>;
};

const CartButton = styled.button`
  border-radius: 12px;
  background: ${COLORS.yellow};
  color: white;
  border: none;
  padding: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  width: 70%;
  min-height: 50px;
  text-transform: uppercase;
`;

export default PurchaseButton;
