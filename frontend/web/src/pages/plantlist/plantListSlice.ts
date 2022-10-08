import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Cookies } from "react-cookie";
import { RootState } from "../../app/store";
import Plant from "../../models/plant";
import { apiGetPlantList, apiUpdatePlant } from "../../api/plantApi";

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
    return [];
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
    renamePlant: (
      state,
      action: PayloadAction<{
        name: string;
        index: number;
      }>
    ) => {
      const { name, index } = action.payload;
      const plant = state.plants[index];
      plant.name = name;
      apiUpdatePlant(plant, index);
    },
    changePlantWateringInterval: (
      state,
      action: PayloadAction<{
        watering_interval: number;
        index: number;
      }>
    ) => {
      const { watering_interval, index } = action.payload;
      const plant = state.plants[index];
      plant.watering_interval = watering_interval;
      apiUpdatePlant(plant, index);
    },
    waterPlant: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      const plant = state.plants[index];
      plant.last_watered = Math.floor(new Date().valueOf() / 1000);
      apiUpdatePlant(plant, index);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(updatePlantListAsync.fulfilled, (state, action) => {
      state.plants = action.payload;
    });
  },
});

export const {
  addPlant,
  removePlant,
  waterPlant,
  renamePlant,
  changePlantWateringInterval,
} = plantListSlice.actions;

export const selectPlantList = (state: RootState) => state.plantList.plants;

export default plantListSlice.reducer;
