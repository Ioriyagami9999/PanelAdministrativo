import { configureStore } from "@reduxjs/toolkit";
import { dummyjsonApi } from "../api/dummyjsonApi";
import authReducer from "../features/auth/authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [dummyjsonApi.reducerPath]: dummyjsonApi.reducer,
  },
  middleware: (gDM) => gDM().concat(dummyjsonApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
