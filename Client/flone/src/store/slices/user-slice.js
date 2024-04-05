const { createSlice } = require("@reduxjs/toolkit");

const userSlice = createSlice({
  name: "user",
  initialState: {
    loggedUser: {},
    isAdmin: false,
  },
  reducers: {
    loginUser(state, action) {
      state.loggedUser = action.payload;
    },
    logoutUser(state) {
      state.loggedUser = {};
    },
  },
});
export const { loginUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;
