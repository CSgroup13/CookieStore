import React from 'react';
import PropTypes from 'prop-types';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Iconify from 'src/components/iconify';
import Popover from '@mui/material/Popover';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Typography, Card, CardContent } from '@mui/material';
import api, { deleteData, putData } from "../../utils/api";
import Dropdown from 'react-bootstrap/Dropdown';
import {Checkbox} from '@mui/material';
import { useSelector } from 'react-redux';

export default function OrderTableRow({
  id,
  userId,
  totalPrice,
  date,
  shippingAddress,
  notes,
  status,
  shippingMethod,
  paymentMethod,
  orderItems,
  selected,
  handleClick,
  deleteOrder,
  updateOrder
}) {
  const [open, setOpen] = React.useState(null);
  const [editedOrder, setEditedOrder] = React.useState({
    id,
    userId,
    totalPrice,
    date,
    shippingAddress,
    notes,
    orderItems,
    status,
    shippingMethod,
    paymentMethod
  });

  const { products } = useSelector((state) => state.product);
  const [openEditDialog, setOpenEditDialog] = React.useState(false);
  const [openItemsDialog, setOpenItemsDialog] = React.useState(false);

  const statusMap = [
    { label: 'Not Paid', color: 'rgba(255, 0, 0, 0.6)' },
    { label: 'Pending', color: 'rgba(255, 165, 0, 0.6)' },
    { label: 'Processing', color: 'rgba(0, 0, 255, 0.6)' },
    { label: 'Shipped', color: 'rgba(0, 128, 0, 0.6)' },
    { label: 'Delivered', color: 'rgba(128, 0, 128, 0.6)' }
  ];

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleEditDialogOpen = () => {
    setOpenEditDialog(true);
  };

  const handleEditDialogClose = () => {
    setOpenEditDialog(false);
  };

  const handleItemsDialogOpen = () => {
    setOpenItemsDialog(true);
  };

  const handleItemsDialogClose = () => {
    setOpenItemsDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedOrder((prevOrder) => ({
      ...prevOrder,
      [name]: value
    }));
  };

  const editOrder = () => {
    const updatedOrder = {
      ...editedOrder,
      shippingMethod: Number(editedOrder.shippingMethod),
      paymentMethod: Number(editedOrder.paymentMethod)
    };
    putData(api.orders + "updateOrder", updatedOrder)
      .then((order) => {
        updateOrder(order);
        setOpenItemsDialog(false);
      })
      .catch((error) => {
        console.error(error);
      })
  };

  const removeOrder = () => {
    deleteData(api.orders + "deleteOrder/" + id)
      .then((deleted) => {
        if (deleted) {
          deleteOrder(id);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleStatusChange = (newStatus) => {
    const newStatusOrder={...editedOrder,status:newStatus}
    putData(api.orders + "updateOrder", newStatusOrder)
      .then((order) => {
        updateOrder(order);
      })
      .catch((error) => {
        console.error(error);
      })
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell>
        <TableCell>{id}</TableCell>
        <TableCell>{userId}</TableCell>
        <TableCell>{totalPrice}₪</TableCell>
        <TableCell>{date.split("T")[0]}</TableCell>
        <TableCell>{shippingAddress}</TableCell>
        <TableCell>{notes || "No notes"}</TableCell>
        <TableCell>
          <Dropdown>
            <Dropdown.Toggle id="dropdown-basic" style={{backgroundColor:statusMap[status].color,borderColor:statusMap[status].color}}>
              {statusMap[status].label}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {statusMap.map((statusItem, index) => (
                <Dropdown.Item key={index} onClick={() => handleStatusChange(index)}>
                  {statusItem.label}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </TableCell>
        <TableCell>{shippingMethod === 1 ? "Shipping" : "PickUp"}</TableCell>
        <TableCell>{paymentMethod === 1 ? "PayPal" : "Cash"}</TableCell>
        <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>


      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { width: 140 },
        }}
      >
        <MenuItem onClick={handleItemsDialogOpen} style={{ color: "#ce0fdb" }}>
          <Iconify icon="mdi:invoice-line-items" style={{ color: "#ce0fdb" }} sx={{ mr: 2 }} />
          Items
        </MenuItem>
        <MenuItem onClick={handleEditDialogOpen}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={removeOrder} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
      <Dialog open={openEditDialog} onClose={handleEditDialogClose}>
        <DialogTitle>Edit Order</DialogTitle>
        <DialogContent>
          <TextField
            name="totalPrice"
            label="Total Price"
            value={editedOrder.totalPrice}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="shippingAddress"
            label="Shipping Address"
            value={editedOrder.shippingAddress}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="notes"
            label="Special Notes"
            value={editedOrder.notes}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="shippingMethod"
            label="Shipping Method"
            value={editedOrder.shippingMethod}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="paymentMethod"
            label="Payment Method"
            value={editedOrder.paymentMethod}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditDialogClose}>Cancel</Button>
          <Button onClick={editOrder}>Done</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openItemsDialog} onClose={handleItemsDialogClose}>
        <DialogTitle>Order Items</DialogTitle>
        <DialogContent>
          {orderItems.map((item, index) => {
            const product = products.find(product => product.id === item.productId);
            if (!product) return null;

            return (
              <Card key={index} style={{ marginBottom: '16px' }}>
                <CardContent>
                  <img src={product.image} style={{ width: '100px', height: '100px', marginRight: '16px', objectFit: 'cover' }} />
                  <Typography variant="body1">
                    {product.name}: {item.quantity}
                  </Typography>
                </CardContent>
              </Card>
            );
          })}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleItemsDialogClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

OrderTableRow.propTypes = {
  id: PropTypes.number.isRequired,
  userId: PropTypes.number.isRequired,
  totalPrice: PropTypes.number.isRequired,
  date: PropTypes.string.isRequired,
  shippingAddress: PropTypes.string.isRequired,
  notes: PropTypes.string,
  status: PropTypes.number.isRequired,
  shippingMethod: PropTypes.number.isRequired,
  paymentMethod: PropTypes.number.isRequired,
  orderItems: PropTypes.array.isRequired,
  selected: PropTypes.bool.isRequired,
  handleClick: PropTypes.func.isRequired,
  deleteOrder: PropTypes.func.isRequired,
  updateOrder: PropTypes.func.isRequired,
};
