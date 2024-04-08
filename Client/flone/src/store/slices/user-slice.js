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
    setAdmin(state) {
      state.isAdmin = true;
    }
  },
});
export const { loginUser, logoutUser, setAdmin } = userSlice.actions;
export default userSlice.reducer;
