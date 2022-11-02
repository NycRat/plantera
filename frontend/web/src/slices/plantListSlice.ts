import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../app/store";
import Plant from "../models/plant";
import {
  apiDeletePlant,
  apiGetPlantImage,
  apiGetPlantList,
  apiUpdatePlant,
} from "../api/plantApi";

export interface PlantListState {
  plants: Plant[];
  plantImages: string[];
}

const initialState: PlantListState = {
  plants: [],
  plantImages: [],
};

export const updatePlantListAsync = createAsyncThunk(
  "plantList/updatePlantList",
  async (username: string) => {
    if (typeof username === "string") {
      return await apiGetPlantList(username);
    }
    return [];
  }
);

export const updatePlantImageAsync = createAsyncThunk(
  "plantList/updatePlantImageAsync",
  async (index: number) => {
    return { index, image: await apiGetPlantImage(index) };
  }
);

export const plantListSlice = createSlice({
  name: "plantList",
  initialState,
  reducers: {
    addPlant: (state, action: PayloadAction<Plant>) => {
      const plant = action.payload;
      state.plants.unshift(plant);
    },
    removePlant: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      apiDeletePlant(index);
      state.plants.splice(index, 1);
    },
    updatePlant: (
      state,
      action: PayloadAction<{
        plant: Plant;
        index: number;
      }>
    ) => {
      const { plant, index } = action.payload;
      state.plants[index] = plant;
      apiUpdatePlant(plant, index);
    },
    clearPlantImages: (state) => {
      state.plantImages = [];
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
  },
  extraReducers: (builder) => {
    builder.addCase(updatePlantListAsync.fulfilled, (state, action) => {
      state.plants = action.payload;
    });
    builder.addCase(updatePlantImageAsync.fulfilled, (state, action) => {
      const { index, image } = action.payload;
      state.plantImages[index] = image;
    });
  },
});

export const {
  addPlant,
  removePlant,
  updatePlant,
  changePlantWateringInterval,
  clearPlantImages,
} = plantListSlice.actions;

export const selectPlantList = (state: RootState) => state.plantList.plants;
export const selectPlantImages = (state: RootState) =>
  state.plantList.plantImages;

export default plantListSlice.reducer;