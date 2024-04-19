import React, { Fragment, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import SEO from "../../components/seo";
import LayoutThree from "../../layouts/LayoutThree";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
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
} from '@mui/material';
import Iconify from 'src/components/iconify';

const UserOrders = () => {
  const { pathname } = useLocation();
  const { userOrders } = useSelector((state) => state.user);
  const { products } = useSelector((state) => state.product);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openItemsDialog, setOpenItemsDialog] = useState(false);

  const statusMap = {
    0: { label: 'Not Paid', color: 'rgba(255, 0, 0, 0.6)' }, 
    1: { label: 'Pending', color: 'rgba(255, 165, 0, 0.6)' }, 
    2: { label: 'Processing', color: 'rgba(0, 0, 255, 0.6)' }, 
    3: { label: 'Shipped', color: 'rgba(0, 128, 0, 0.6)' }, 
    4: { label: 'Delivered', color: 'rgba(128, 0, 128, 0.6)' }
  };


  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setOpenItemsDialog(true);
  };

  const handleCloseItemsDialog = () => {
    setSelectedOrder(null);
    setOpenItemsDialog(false);
  };

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
            { label: "Your Orders", path: process.env.PUBLIC_URL + pathname },
          ]}
        />
        <div className="container" style={{ display: 'flex', justifyContent: 'center' }}>
          <div className="cart-main-area pt-20 pb-100">
            <div className="container">
              {userOrders && userOrders.length >= 1 ? (
                <Fragment>
                  <div className="row">
                    <div className="col-12">
                      <div className="table-content table-responsive cart-table-content">
                        <table>
                          <thead>
                            <tr>
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
                              <TableRow key={order.id} hover tabIndex={-1} role="checkbox" selected={selectedOrder}>
                                <TableCell>{order.id}</TableCell>
                                <TableCell>{order.totalPrice.toFixed(2)}₪</TableCell>
                                <TableCell>{new Date(order.date).toLocaleString()}</TableCell>
                                <TableCell>{order.shippingAddress}</TableCell>
                                <TableCell>
                                  <Button style={{ backgroundColor: statusMap[order.status].color, color: 'white' }}>
                                    {statusMap[order.status].label}
                                  </Button>
                                </TableCell>                                <TableCell>
                                  <IconButton onClick={() => handleOrderClick(order)}>
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
                          <Link to={process.env.PUBLIC_URL + "/shop-grid-standard"}>
                            Continue Shopping
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </Fragment>
              ) : (
                <div className="row">
                  <div className="col-lg-12">
                    <div className="item-empty-area text-center">
                      <div className="item-empty-area__icon mb-30">
                        <i className="pe-7s-ribbon"></i>
                      </div>
                      <div className="item-empty-area__text">
                        No orders found. <br />{" "}
                        <Link to={process.env.PUBLIC_URL + "/shop-grid-standard"}>
                          Start Shopping
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </LayoutThree>
      <Dialog open={openItemsDialog} onClose={handleCloseItemsDialog}>
        <DialogTitle>Order Items</DialogTitle>
        <DialogContent>
          {selectedOrder && selectedOrder.orderItems.map((item, index) => {
            const product = products.find(product => product.id === item.productId);
            if (!product) return null;
            return (
              <Card key={index} style={{ marginBottom: '16px' }}>
                <CardContent>
                  <CardMedia
                    component="img"
                    src={product.image}
                    style={{ width: '100px', height: '100px', marginRight: '16px', objectFit: 'cover' }}
                  />
                  <Typography variant="body1">
                    {product.name}: {item.quantity}
                  </Typography>
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
