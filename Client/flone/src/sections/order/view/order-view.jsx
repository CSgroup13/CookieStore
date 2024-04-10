import { useState } from 'react';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import Scrollbar from 'src/components/scrollbar';
import TableNoData from '../table-no-data';
import OrderTableRow from '../order-table-row';
import OrderTableHead from '../order-table-head';
import TableEmptyRows from '../table-empty-rows';
import OrderTableToolbar from '../order-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';
import api, { deleteData } from "../../../utils/api"
import { useDispatch, useSelector } from "react-redux";
import { setOrders } from "../../../store/slices/order-slice";

// ----------------------------------------------------------------------

export default function OrderPage() {
  const dispatch = useDispatch();

  const { orders } = useSelector((state) => state.order);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = orders.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const deleteOrder = (orderId) => {
    dispatch(setOrders(orders.filter((order) => order.id !== orderId)));
  }

  const updateOrder = (updatedOrder) => {
    dispatch(setOrders(orders.map((order) => {
      if (order.id === updatedOrder.id) {
        return updatedOrder;
      } else {
        return order;
      }
    })));
  };


  const deleteSelected = () => {
    // Iterate over the selected array and delete each selected order
    selected.forEach((orderId) => {
      // Call your delete API here to delete the order by ID
      deleteData(api.orders + "deleteOrder/" + orderId)
        .then((deleted) => {
          if (deleted) {
            deleteOrder(orderId)
          }
        })
        .catch((error) => {
          console.error(error);
        });
    });
    // Clear the selected array after deletion
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const dataFiltered = applyFilter({
    inputData: orders,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;


  return (
    <Container>
      <Card>
        <OrderTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
          onDelete={deleteSelected}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <OrderTableHead
                order={order}
                orderBy={orderBy}
                rowCount={orders.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'id', label: 'Order ID' },
                  { id: 'userId', label: 'User ID' },
                  { id: 'totalPrice', label: 'Total Price' },
                  { id: 'date', label: 'Order Date' },
                  { id: 'shippingAddress', label: 'Shipping Address' },
                  { id: 'notes', label: 'Special Notes' },
                  { id: 'status', label: 'Status' },
                  { id: 'shippingMethod', label: 'Shipping Method' },
                  { id: 'paymentMethod', label: 'Payment Method' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    return (
                      <OrderTableRow
                        key={row.id}
                        id={row.id}
                        userId={row.userId}
                        totalPrice={row.totalPrice}
                        date={row.date}
                        shippingAddress={row.shippingAddress}
                        notes={row.notes}
                        status={row.status}
                        shippingMethod={row.shippingMethod}
                        paymentMethod={row.paymentMethod}
                        orderItems={row.orderItems}
                        selected={selected.indexOf(row.id) !== -1}
                        handleClick={(event) => handleClick(event, row.id)}
                        deleteOrder={deleteOrder}
                        updateOrder={updateOrder}
                      />
                    )
                  })}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, orders.length)}
                />

                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>
        <TablePagination
          page={page}
          component="div"
          count={orders.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}
