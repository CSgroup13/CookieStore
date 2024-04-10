import { useState } from 'react';
import PropTypes from 'prop-types';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Iconify from 'src/components/iconify';
import api, { putData, deleteData } from "../../utils/api";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  CardMedia,
} from '@mui/material';
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
  const { products } = useSelector((state) => state.product);

  const [open, setOpen] = useState(null);
  const [editedOrder, setEditedOrder] = useState({
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

  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openItemsDialog, setOpenItemsDialog] = useState(false);

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

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell>
        <TableCell>{id}</TableCell>
        <TableCell>{userId}</TableCell>
        <TableCell>{totalPrice}</TableCell>
        <TableCell>{date}</TableCell>
        <TableCell>{shippingAddress}</TableCell>
        <TableCell>{notes}</TableCell>
        <TableCell>{status}</TableCell>
        <TableCell>{shippingMethod}</TableCell>
        <TableCell>{paymentMethod}</TableCell>
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
  name: PropTypes.any,
  email: PropTypes.any,
  password: PropTypes.any,
  phone: PropTypes.any,
  role: PropTypes.any,
  address: PropTypes.any,
  regDate: PropTypes.string
};
