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
  TextField
} from '@mui/material';

export default function UserTableRow({
  id,
  name,
  email,
  password,
  phone,
  address,
  regDate,
  selected,
  handleClick,
  deleteUser,
  updateUser
}) {
  const [open, setOpen] = useState(null);
  const [editedUser, setEditedUser] = useState({
    id,
    name,
    email,
    password,
    phone,
    address,
    regDate
  });

  const [openEditDialog, setOpenEditDialog] = useState(false);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prevUser) => ({
      ...prevUser,
      [name]: value
    }));
  };

  const editUser = () => {
    const updatedUser = { ...editedUser }; 
    const firstName=updatedUser.name.split(" ")[0]
    const lastName=updatedUser.name.split(" ")[1]
    delete updatedUser.name;
    updatedUser.firstName=firstName
    updatedUser.lastName=lastName
    putData(api.users + "update", updatedUser)
      .then((user) => {
        updateUser(user);
        setOpenEditDialog(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const removeUser = () => {
    deleteData(api.users + "remove/" + id)
      .then((deleted) => {
        if (deleted) {
          deleteUser(id);
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
        <TableCell>{name}</TableCell>
        <TableCell>{email}</TableCell>
        <TableCell>{password}</TableCell>
        <TableCell>{phone}</TableCell>
        <TableCell>{address}</TableCell>
        <TableCell>{regDate.split("T")[0]}</TableCell>
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
        <MenuItem onClick={handleEditDialogOpen}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={removeUser} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
      <Dialog open={openEditDialog} onClose={handleEditDialogClose}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <TextField
            name="name"
            label="Name"
            value={editedUser.name}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="email"
            label="email"
            value={editedUser.email}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="password"
            label="Password"
            value={editedUser.password}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="phone"
            label="Phone"
            value={editedUser.phone}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="address"
            label="Address"
            value={editedUser.address}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditDialogClose}>Cancel</Button>
          <Button onClick={editUser}>Done</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

UserTableRow.propTypes = {
  name: PropTypes.any,
  email: PropTypes.any,
  password: PropTypes.any,
  phone: PropTypes.any,
  role: PropTypes.any,
  address: PropTypes.any,
  regDate: PropTypes.string
};
