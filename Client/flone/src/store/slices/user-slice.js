const { createSlice } = require("@reduxjs/toolkit");

const userSlice = createSlice({
  name: "user",
  initialState: {
    users: [],
    loggedUser: {},
    isAdmin: false,
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
    setAdmin(state) {
      state.isAdmin = true;
    }
  },
});
export const { setUsers, loginUser, logoutUser, setAdmin } = userSlice.actions;
export default userSlice.reducer;
