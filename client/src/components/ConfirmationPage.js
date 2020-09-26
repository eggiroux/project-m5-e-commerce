import React from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import {
  requestItemList,
  receiveItemList,
  receiveItemListError,
} from "../actions";

import LoadingSpinner from "./LoadingSpinner";

const ConfirmationPage = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { status, error, itemList } = useSelector((state) => state.items);
  const totalPrice = useSelector((state) => state.purchase.totalPrice);

  const myCart = location.state.cart;
  let itemIds = "";

  console.log(totalPrice);

  myCart.forEach((item) => {
    let itemId = Object.keys(item);
    itemIds += `${itemId[0]},`;
  });

  console.log(itemList);

  React.useEffect(() => {
    dispatch(requestItemList());
    fetch(`/items/list/${itemIds}`)
      .then((res) => res.json())
      .then((itemList) => {
        if (!itemList.Error) {
          dispatch(receiveItemList(itemList));
        } else {
          dispatch(receiveItemListError(error));
        }
      })
      .catch((error) => dispatch(receiveItemListError(error)));
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, []);

  const key = uuidv4();

  if (status === "loading") {
    return <LoadingSpinner />;
  }

  return (
    <OrderSummary>
      <OrderBanner>
        <OrderTitle>Thank you for your order</OrderTitle>
        <OrderConfirmation>
          <h3>ORDER CONFIRMATION</h3>
          <h4>{key}</h4>
        </OrderConfirmation>
        <CustomerInfo>
          <h4>Order by: </h4>
          <div>Name of Customer</div>
        </CustomerInfo>
      </OrderBanner>

      {status === "idle" && (
        <OrderDetails>
          <CustomerPurchases>
            {itemList.map((item) => {
              return (
                <CustomerItem key={item.name}>
                  <ProductName>{item.name}</ProductName>
                  {item.qty > 1 && (
                    <ProductQuantity>x {item.qty}</ProductQuantity>
                  )}
                  <ProductPrice>{item.price}</ProductPrice>
                </CustomerItem>
              );
            })}
            <TotalPrice>
              <TotalPriceLbl>Total Price: </TotalPriceLbl>
              <TotalPriceQuote>${totalPrice.toFixed(2)} </TotalPriceQuote>
            </TotalPrice>
          </CustomerPurchases>
        </OrderDetails>
      )}
    </OrderSummary>
  );
};

const TotalPrice = styled.div`
  display: flex;
  padding: 2%;
  justify-content: space-between;
`;

const TotalPriceLbl = styled.h4``;

const TotalPriceQuote = styled.h4``;

const OrderTitle = styled.h2`
  padding: 2%;
`;

const CustomerItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 2%;
`;

const ProductName = styled.div`
  width: 90%;
`;

const ProductPrice = styled.div``;

const ProductQuantity = styled.h4`
  text-align: left;
`;

const CustomerPurchases = styled.div`
  flex: 2;
`;

const CustomerImg = styled.img`
  flex: 1;
`;

const OrderDetails = styled.div`
  display: flex;
`;

const CustomerInfo = styled.div`
  display: flex;
  flex-direction: column;
  padding: 2%;
`;

const OrderConfirmation = styled.div`
  background-color: LightGreen;
  padding: 2%;
`;

const OrderBanner = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
`;

const OrderSummary = styled.div`
  margin-top: 2%;
  width: 90%;
  margin: 0 auto;
  border: 1px solid black;
  border-radius: 25px;
`;

export default ConfirmationPage;