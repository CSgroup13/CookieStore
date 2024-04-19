import api, { deleteData } from "../../utils/api";
import cogoToast from "cogo-toast";

const { createSlice } = require("@reduxjs/toolkit");

const orderSlice = createSlice({
  name: "order",
  initialState: {
    orders: []
  },
  reducers: {
    setOrders(state, action) {
      state.orders = action.payload;
    },
    addToOrders(state, action) {
      state.orders.push(action.payload);
    },
    deleteFromOrders(state, action) {
      state.orders = state.orders.filter(
        (item) => item.id !== action.payload.id
      );
      deleteData(`${api.orders}${action.payload}`);
      cogoToast.error("Removed From Orders", { position: "bottom-left" });
    },
    deleteAllOrders(state) {
      state.orders = [];
    },
  },
});
export const { setOrders,addToOrders,deleteFromOrders, deleteAllOrders} = orderSlice.actions;
export default orderSlice.reducer;