import React, { Fragment, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import SEO from "../../components/seo";
import LayoutThree from "../../layouts/LayoutThree";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import api, { getData, postData } from "../../utils/api";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  TableRow,
  TableCell,
  Rating,
} from "@mui/material";
import Iconify from "src/components/iconify";
import cogoToast from "cogo-toast";
import { setProducts } from "src/store/slices/product-slice";

const UserOrders = () => {
  const { pathname } = useLocation();
  const { userOrders, loggedUser } = useSelector((state) => state.user);
  const { products } = useSelector((state) => state.product);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openItemsDialog, setOpenItemsDialog] = useState(false);
  const [searchOrderId, setSearchOrderId] = useState("");
  const [searchResult, setSearchResult] = useState(null); // State to store search result
  const dispatch = useDispatch();
  const statusMap = {
    0: { label: "Not Paid", color: "rgba(255, 0, 0, 0.6)" },
    1: { label: "Pending", color: "rgba(255, 165, 0, 0.6)" },
    2: { label: "Processing", color: "rgba(0, 0, 255, 0.6)" },
    3: { label: "Shipped", color: "rgba(0, 128, 0, 0.6)" },
    4: { label: "Delivered", color: "rgba(128, 0, 128, 0.6)" },
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchOrderId !== "") {
      getData(`${api.orders}order/${searchOrderId}`)
        .then((foundOrder) => {
          setSearchResult(foundOrder);
        })
        .catch((error) => {
          setSearchResult("cannot find this order.");
        });
    }
  };

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setOpenItemsDialog(true);
  };

  const handleCloseItemsDialog = () => {
    setSelectedOrder(null);
    setOpenItemsDialog(false);
  };

  const mainLabel =
    userOrders && userOrders.length >= 1 ? "Your Orders" : "Search Orders";

  return (
    <Fragment>
      <SEO
        titleTemplate="User Orders"
        description="Orders page of flone react minimalist eCommerce template."
      />
      <LayoutThree headerTop="visible">
        <Breadcrumb
          pages={[
            { label: "Home", path: process.env.PUBLIC_URL + "/" },
            { label: mainLabel, path: process.env.PUBLIC_URL + pathname },
          ]}
        />
        <div className="cart-main-area pt-90 pb-100">
          <div className="container">
            {userOrders && userOrders.length >= 1 ? (
              <Fragment>
                <div className="row">
                  <div className="col-12">
                    <div className="table-content table-responsive cart-table-content">
                      <table>
                        <thead>
                          <tr key="head">
                            <th>Order ID</th>
                            <th>Total Price</th>
                            <th>Date</th>
                            <th>Shipping Address</th>
                            <th>Status</th>
                            <th>Items</th>
                          </tr>
                        </thead>
                        <tbody>
                          {userOrders.map((order) => (
                            <TableRow
                              key={order.id}
                              hover
                              tabIndex={-1}
                              role="checkbox"
                              selected={selectedOrder}
                            >
                              <TableCell>{order.id}</TableCell>
                              <TableCell>
                                {order.totalPrice.toFixed(2)}₪
                              </TableCell>
                              <TableCell>
                                {new Date(order.date).toLocaleString()}
                              </TableCell>
                              <TableCell>{order.shippingAddress}</TableCell>
                              <TableCell>
                                <Button
                                  style={{
                                    backgroundColor:
                                      statusMap[order.status].color,
                                    color: "white",
                                  }}
                                >
                                  {statusMap[order.status].label}
                                </Button>
                              </TableCell>
                              <TableCell>
                                <IconButton
                                  onClick={() => handleOrderClick(order)}
                                >
                                  <Iconify icon="eva:eye-outline" />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-12">
                    <div className="cart-shiping-update-wrapper">
                      <div className="cart-shiping-update">
                        <Link
                          to={process.env.PUBLIC_URL + "/shop-grid-standard"}
                        >
                          Continue Shopping
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </Fragment>
            ) : (
              <>
                <div className="row">
                  <div className="col-lg-12">
                    {/* Render search form if user is not logged in */}
                    <form
                      onSubmit={handleSearchSubmit}
                      style={{ marginBottom: "20px" }}
                    >
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter Order ID"
                          value={searchOrderId}
                          onChange={(e) => setSearchOrderId(e.target.value)}
                          style={{
                            borderColor: "#BC7FCD",
                            outlineColor: "#BC7FCD",
                          }}
                        />
                        <button
                          type="submit"
                          className="btn"
                          style={{
                            backgroundColor: "#BC7FCD",
                            color: "white",
                          }}
                        >
                          Search
                        </button>
                      </div>
                    </form>
                  </div>
                </div>

                {searchResult && searchResult.id ? (
                  <div className="row">
                    <div className="col-12">
                      <Typography variant="h4">
                        Order {searchResult.id}
                      </Typography>
                      <div>
                        <Typography variant="body1">
                          Total Price: {searchResult.totalPrice.toFixed(2)}₪
                        </Typography>
                        <Typography variant="body1">
                          Date: {new Date(searchResult.date).toLocaleString()}
                        </Typography>
                        <Typography variant="body1">
                          Shipping Address: {searchResult.shippingAddress}
                        </Typography>
                        <Typography variant="body1">
                          Payment Method:{" "}
                          {searchResult.paymentMethod === 1 ? "Paypal" : "Cash"}
                        </Typography>
                        <Typography variant="body1">
                          Status:{" "}
                          <span
                            style={{
                              color: statusMap[searchResult.status].color,
                            }}
                          >
                            {statusMap[searchResult.status].label}
                          </span>
                        </Typography>
                        <Typography variant="h6">Items:</Typography>
                        {searchResult.orderItems.map((item) => {
                          const product = products.find(
                            (product) => product.id === item.productId
                          );
                          if (product) {
                            return (
                              <div
                                key={item.id}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  marginBottom: "20px",
                                }}
                              >
                                <img
                                  src={process.env.PUBLIC_URL+product.image}
                                  alt={product.name}
                                  style={{
                                    width: "100px",
                                    marginRight: "20px",
                                  }}
                                />
                                <div>
                                  <Typography variant="body1">
                                    {product.name} - {item.quantity}
                                  </Typography>
                                  <Typography variant="body2">
                                    {product.description}
                                  </Typography>
                                </div>
                              </div>
                            );
                          } else {
                            return null;
                          }
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  <span>{searchResult}</span>
                )}
              </>
            )}
          </div>
        </div>
      </LayoutThree>
      <Dialog open={openItemsDialog} onClose={handleCloseItemsDialog}>
        <DialogTitle>Order Items</DialogTitle>
        <DialogContent>
          {selectedOrder &&
            selectedOrder.orderItems.map((item, index) => {
              const product = products.find(
                (product) => product.id === item.productId
              );
              if (!product) return null;
              return (
                <Card key={index} style={{ marginBottom: "16px" }}>
                  <CardContent>
                    <CardMedia
                      component="img"
                      src={process.env.PUBLIC_URL+product.image}
                      style={{
                        width: "100px",
                        height: "100px",
                        marginRight: "16px",
                        objectFit: "cover",
                      }}
                    />
                    <Typography variant="body1">
                      {product.name}: {item.quantity}
                    </Typography>
                    <Rating
                      onChange={(event, newValue) => {
                        newValue = newValue === null ? product.rate : newValue;
                        postData(
                          `${api.products}rateProduct/${product.id}/${loggedUser.id}/${newValue}`
                        )
                          .then((newRate) => {
                            const index = products.findIndex(
                              (prod) => prod.id === product.id
                            );
                            if (index !== -1) {
                              const updatedProducts = [...products]; // Create a copy of the original array
                              updatedProducts[index] = {
                                ...updatedProducts[index],
                                rate: newRate,
                              }; // Update the specific product
                              dispatch(setProducts(updatedProducts)); // Dispatch the action with the updated array
                            }
                            cogoToast.success("Thanks for your feedback!");
                          })
                          .catch((err) => {
                            console.log(err);
                            cogoToast.error(
                              "Something went wrong in the rating process"
                            );
                          });
                      }}
                      value={product.rate}
                    />
                  </CardContent>
                </Card>
              );
            })}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseItemsDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

export default UserOrders;
