import { createRef, FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { formatTime, useQuery } from "../utils";
import {
  removePlant,
  renamePlant,
  selectPlantList,
} from "../slices/plantListSlice";

const PlantPage = (): JSX.Element => {
  const plantList = useAppSelector(selectPlantList);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const query = useQuery();
  const indexStr = query.get("index");
  const [now, setNow] = useState(new Date().valueOf() / 1000 / 60);
  const plantNameInputRef = createRef<HTMLInputElement>();

  const index = indexStr ? parseInt(indexStr) : -1;

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date().valueOf() / 1000 / 60);
    }, 1000);
    return () => clearInterval(interval);
  }, [dispatch, index]);

  useEffect(() => {
    console.log(now);
  }, [now]);

  const plant = plantList[index];

  if (plant === undefined && plantList.length === 0) {
    return (
      <div className="page">
        <h1>Loading ...</h1>
      </div>
    );
  }

  if (plant === undefined) {
    return (
      <div className="page">
        <h1>404 Plant not found</h1>
      </div>
    );
  }

  const handleRenamePlant = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (plantNameInputRef.current !== null) {
      console.log(plantNameInputRef.current.value);
      dispatch(
        renamePlant({
          name: plantNameInputRef.current.value,
          index: index,
        })
      );
    }
  };

  console.log(plant);

  return (
    <div className="page">
      {/* <img src={plantList[index].image} alt="haha" /> */}
      <form onSubmit={handleRenamePlant} onBlur={handleRenamePlant}>
        <input
          ref={plantNameInputRef}
          defaultValue={plant.name}
          className="text-4xl text-center bg-transparent border-none mt-7"
        />
      </form>
      <h2>Water every: {formatTime(plant.watering_interval)}</h2>
      <h2>
        Water in:{" "}
        {formatTime(plant.last_watered + plant.watering_interval - now)}
      </h2>
      <button
        onClick={() => {
          dispatch(removePlant(index));
          navigate("/plant_list");
        }}
        className="px-2 py-1 rounded-full
        duration-100 bg-color-dark-2 hover:bg-color-dark-1"
      >
        Remove Plant
      </button>
    </div>
  );
};

export default PlantPage;
