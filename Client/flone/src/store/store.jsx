import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import productReducer from "./slices/product-slice";
import currencyReducer from "./slices/currency-slice";
import cartReducer from "./slices/cart-slice";
import compareReducer from "./slices/compare-slice";
import wishlistReducer from "./slices/wishlist-slice";
import userReducer from "./slices/user-slice";
import notificationsReducer from "./slices/notifications-slice";
import orderReducer from "./slices/order-slice";

const persistConfig = {
  key: "flone",
  version: 1.1,
  storage,
  blacklist: ["product"],
};

export const rootReducer = combineReducers({
  user: userReducer,
  product: productReducer,
  order: orderReducer,
  currency: currencyReducer,
  cart: cartReducer,
  compare: compareReducer,
  wishlist: wishlistReducer,
  notifications: notificationsReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
