import cogoToast from "cogo-toast";
import api, { postData } from "../../utils/api";
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
    logoutUser(state, action) {
      return (state = {
        loggedUser: {},
        isAdmin: false,
      });
    },
  },
});
export const { loginUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;
