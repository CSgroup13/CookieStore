const { createSlice } = require("@reduxjs/toolkit");

const userSlice = createSlice({
  name: "user",
  initialState: {
    users: [],
    loggedUser: {},
    isAdmin: false,
    userOrders:[]
  },
  reducers: {
    setUsers(state, action) {
      state.users = action.payload;
    },
    loginUser(state, action) {
      state.loggedUser = action.payload;
    },
    logoutUser(state) {
      state.loggedUser = {};
    },
    setAdmin(state, action) {
      state.isAdmin = action.payload;
    },
    setUserOrders(state, action) {
      state.userOrders = action.payload;
    },
    addToUserOrders(state, action) {
      state.userOrders.push(action.payload);
    },
  },
});
export const { setUsers, loginUser, logoutUser, setAdmin,setUserOrders,addToUserOrders } = userSlice.actions;
export default userSlice.reducer;
