import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import plantListReducer from "../pages/plantlist/plantListSlice";
import counterReducer from "../features/counter/counterSlice";

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
