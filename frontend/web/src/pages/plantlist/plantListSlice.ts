import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import Plant from "../../models/plant";
import {
  apiDeletePlant,
  apiGetPlantImage,
  apiGetPlantList,
  apiPostNewPlant,
  apiUpdatePlant,
} from "../../api/plantApi";

export interface PlantListState {
  plants: Plant[];
  plantImages: string[]
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
      apiPostNewPlant(plant);
    },
    removePlant: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      apiDeletePlant(index);
      state.plants.splice(index, 1);
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
    builder.addCase(updatePlantImageAsync.fulfilled, (state, action) => {
      const { index, image } = action.payload;
      state.plantImages[index] = image;
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
export const selectPlantImages = (state: RootState) => state.plantList.plantImages;

export default plantListSlice.reducer;
