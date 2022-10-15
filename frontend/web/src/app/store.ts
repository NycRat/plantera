import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import plantListReducer from "../slices/plantListSlice";

export const store = configureStore({
  reducer: {
    plantList: plantListReducer,
    // counter: counterReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
