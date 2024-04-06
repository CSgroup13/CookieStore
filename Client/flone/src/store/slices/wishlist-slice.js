import cogoToast from "cogo-toast";
import api, { deleteData, postData } from "../../utils/api";
const { createSlice } = require("@reduxjs/toolkit");

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    wishlistItems: [],
  },
  reducers: {
    setWishlist(state, action) {
      state.wishlistItems = action.payload;
    },
    addToWishlist(state, action) {
      const isInWishlist = state.wishlistItems.findIndex(
        (item) => item.id === action.payload.id
      );
      if (isInWishlist > -1) {
        cogoToast.info("Product already in wishlist", {
          position: "bottom-left",
        });
      } else {
        state.wishlistItems.push(action.payload);
        postData(`${api.users}${action.payload.userId}/${action.payload.id}`);
        cogoToast.success("Added To wishlist", { position: "bottom-left" });
      }
    },
    deleteFromWishlist(state, action) {
      state.wishlistItems = state.wishlistItems.filter(
        (item) => item.id !== action.payload.id
      );
      deleteData(`${api.users}${action.payload.userId}/${action.payload.id}`);
      cogoToast.error("Removed From Wishlist", { position: "bottom-left" });
    },
    deleteAllFromWishlist(state) {
      state.wishlistItems = [];
    },
  },
});

export const {
  setWishlist,
  addToWishlist,
  deleteFromWishlist,
  deleteAllFromWishlist,
} = wishlistSlice.actions;
export default wishlistSlice.reducer;
