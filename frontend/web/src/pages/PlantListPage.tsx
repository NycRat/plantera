import { createRef, FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiPostNewPlant, apiPostPlantImage } from "../api/plantApi";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import Plant from "../models/plant";
import { addPlant, selectPlantList } from "../slices/plantListSlice";

const PlantListPage = (): JSX.Element => {
  const navigate = useNavigate();
  const plantList = useAppSelector(selectPlantList);
  const dispatch = useAppDispatch();
  const plantImageRef = createRef<HTMLInputElement>();
  const [preview, setPreview] = useState("");

  const defaultNewPlant: Plant = {
    name: "Plant",
    note: "this is a note about the plant",
    last_watered: 0,
    watering_interval: 30,
  };

  const handleUpdatePlantImage = async () => {
    if (plantImageRef.current === null) {
      return;
    }

    let reader = new FileReader();
    reader.onload = async () => {
      if (typeof reader.result === "string") {
        setPreview(reader.result);
      }
    };

    if (plantImageRef.current.files !== null) {
      const image = plantImageRef.current.files[0];
      if (image !== undefined) {
        reader.readAsDataURL(plantImageRef.current.files[0]);
      }
    }
  };

  const handleCreatePlant = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    let newPlant = defaultNewPlant;
    if (preview !== "") {
      newPlant.image = preview;
    }
    dispatch(addPlant(newPlant));
    await apiPostNewPlant(newPlant);
    await apiPostPlantImage(preview, 0);

    setPreview("");
  };

  return (
    <div>
      <div
        className="absolute top-24 left-1/2 -translate-x-1/2 text-center 
        w-[90vw] h-[80vh] py-[20px] bg-color-dark-1 overflow-y-scroll 
        border-4 border-black rounded-lg"
      >
        <h1 className="m-0 mb-4 text-6xl">Plants</h1>
        {plantList.map((plant, i) => (
          <div
            key={i}
            onClick={() => {
              navigate(`/plant?index=${i}`);
            }}
            className="relative inline-block 
            w-[calc(90vw-60px)]
            h-[calc(90vw-60px)] 
            sm:w-[calc(90vw/2-90px/2)]
            sm:h-[calc(90vw/2-90px/2)] 
            md:w-[calc(90vw/3-100px/3)]
            md:h-[calc(90vw/3-100px/3)] 
            lg:sm:w-[calc(90vw/4-100px/4)]
            lg:sm:h-[calc(90vw/4-100px/4)] 
            rounded-lg mx-[5px] my-[2px] bg-color-light-1 transition-shadow
            hover:shadow-2xl cursor-pointer border border-black
            overflow-hidden whitespace-nowrap"
          >
            {plantList[i].image && (
              <img
                src={plantList[i].image}
                alt={plant.name}
                className="left-0 top-0 absolute w-[100%] h-[100%] object-cover
                rounded-lg"
              />
            )}
            <h2 className="mx-2 absolute bottom-0 text-3xl">{plant.name}</h2>
          </div>
        ))}
      </div>
      <input
        type={"file"}
        ref={plantImageRef}
        className="bg-white text-black"
        onChange={handleUpdatePlantImage}
      />
      <form onSubmit={handleCreatePlant}>
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
