import { createRef, FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiPostNewPlant, apiPostPlantImage } from "../api/plantApi";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import Plant from "../models/plant";
import {
  addPlant,
  selectPlantImages,
  selectPlantList,
} from "../slices/plantListSlice";

const PlantListPage = (): JSX.Element => {
  const navigate = useNavigate();
  const plantList = useAppSelector(selectPlantList);
  const plantImages = useAppSelector(selectPlantImages);
  const dispatch = useAppDispatch();
  const plantImageRef = createRef<HTMLInputElement>();
  const [preview, setPreview] = useState("");

  const defaultNewPlant: Plant = {
    name: "GREAT PLANT XD",
    last_watered: 0,
    watering_interval: 30,
  };

  const handleCreatePlant = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(addPlant(defaultNewPlant));
    await apiPostNewPlant(defaultNewPlant);

    if (plantImageRef.current === null) {
      return;
    }

    let reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setPreview(reader.result);
        apiPostPlantImage(reader.result, 0);
      }
    };

    if (plantImageRef.current.files !== null) {
      const image = plantImageRef.current.files[0];
      if (image !== undefined) {
        reader.readAsDataURL(plantImageRef.current.files[0]);
      }
    }
  };

  return (
    <div>
      <div
        className="absolute top-24 left-1/2 -translate-x-1/2 text-center 
        w-[90vw] h-[80vh] p-[20px] bg-color-dark-1 overflow-y-scroll 
        border-4 border-black rounded-lg"
      >
        <h1 className="m-0 mb-4 text-6xl">Plants</h1>
        {plantList.map((plant, i) => (
          <div
            key={i}
            onClick={() => {
              navigate(`/plant?index=${i}`);
            }}
            className="relative inline-block w-[calc(90vw/4-100px/4)]
            h-[calc(90vw/4-100px/4)] rounded-lg mx-[5px] my-[2px] bg-color-light-1 
            duration-200 hover:shadow-2xl cursor-pointer border border-black
            "
          >
            {plantImages[i] && (
              <img
                src={plantImages[i]}
                alt={plant.name}
                className="left-0 top-0 absolute w-[100%] h-[100%] object-cover
                rounded-lg"
              />
            )}
            <h2 className="mx-4 absolute bottom-0 text-3xl">{plant.name}</h2>
          </div>
        ))}
      </div>
      <form onSubmit={handleCreatePlant}>
        <input
          type={"file"}
          ref={plantImageRef}
          className="bg-white text-black"
        />
        <input
          type={"submit"}
          value={"NEW PLANT"}
          className="px-2 py-1 rounded-full m-2
          duration-100 bg-color-dark-2 hover:bg-color-dark-1"
        />
      </form>
      <img src={preview} alt={"haha"} />
    </div>
  );
};
export default PlantListPage;
