import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Cookies } from "react-cookie";
import { RootState } from "../../app/store";
import Plant from "../../models/plant";
import { apiGetPlantList } from "../../api/plantApi";

export interface PlantListState {
  plants: Plant[];
}

const initialState: PlantListState = {
  plants: [],
};

export const updatePlantListAsync = createAsyncThunk(
  "plantList/updatePlantList",
  async () => {
    const cookies = new Cookies();
    const username = cookies.get("username");
    if (typeof username === "string") {
      return apiGetPlantList(username);
    }
  }
);

export const plantListSlice = createSlice({
  name: "plantList",
  initialState,
  reducers: {
    addPlant: (state, action: PayloadAction<Plant>) => {
      state.plants.push(action.payload);
    },
    removePlant: (state, action: PayloadAction<number>) => {
      state.plants.splice(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(updatePlantListAsync.fulfilled, (state, action) => {
      state.plants = action.payload;
    });
  },
});

export const { addPlant, removePlant } = plantListSlice.actions;

export const selectPlantList = (state: RootState) => state.plantList.plants;

export default plantListSlice.reducer;
