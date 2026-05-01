import { configureStore } from "@reduxjs/toolkit";
import authReducer    from "./slices/authSlice";
import libraryReducer from "./slices/librarySlice";
import wishlistReducer from "./slices/wishlistSlice";

const store = configureStore({
  reducer: {
    auth:     authReducer,
    library:  libraryReducer,
    wishlist: wishlistReducer,
  },
  devTools: import.meta.env.DEV, // Enable Redux DevTools only in development
});

export default store;
