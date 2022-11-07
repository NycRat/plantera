import { createRef, FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { formatTime, useQuery } from "../utils";
import {
  removePlant,
  selectPlantList,
  updatePlant,
} from "../slices/plantListSlice";

const PlantPage = (): JSX.Element => {
  const plantList = useAppSelector(selectPlantList);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const query = useQuery();
  const indexStr = query.get("index");
  const [now, setNow] = useState(new Date().valueOf() / 1000 / 60);
  const plantNameInputRef = createRef<HTMLInputElement>();
  const plantNoteInputRef = createRef<HTMLTextAreaElement>();

  const index = indexStr ? parseInt(indexStr) : -1;

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date().valueOf() / 1000 / 60);
    }, 1000);
    return () => clearInterval(interval);
  }, [dispatch, index]);

  const plant = plantList[index];

  useEffect(() => {
    console.log(plant);
  }, [plant]);

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
        updatePlant({
          plant: { ...plant, name: plantNameInputRef.current.value },
          index: index,
        })
      );
    }
  };

  const handleUpdatePlantNote = (event: FormEvent<HTMLTextAreaElement>) => {
    event.preventDefault();
    if (plantNoteInputRef.current) {
      const note = plantNoteInputRef.current.value;
      dispatch(updatePlant({ plant: { ...plant, note }, index }));
    }
    console.log(plantNoteInputRef.current?.value);
  };

  return (
    <div className="page">
      {plantList[index].image ? (
        <img
          src={plantList[index].image}
          alt="plant"
          className="absolute z-0 rounded-full border-8
        h-[85vh] w-[85vh]
        top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        />
      ) : (
        <div
          className="absolute z-0 rounded-full border-8 h-[85vh] w-[85vh]
            top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        ></div>
      )}
      <div
        className="absolute z-10 w-1/3
        top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
        p-5 rounded-lg bg-[#141518f2]"
      >
        <form onSubmit={handleRenamePlant} onBlur={handleRenamePlant}>
          <input
            ref={plantNameInputRef}
            defaultValue={plant.name}
            className="text-4xl text-center bg-transparent border-none"
          />
        </form>
        <h2>Water every: {formatTime(plant.watering_interval)}</h2>
        <h2>
          Water in:{" "}
          {formatTime(plant.last_watered + plant.watering_interval - now)}
        </h2>
        <textarea
          ref={plantNoteInputRef}
          defaultValue={plant.note}
          className="text-black resize-none w-11/12 h-72 max-w-md rounded-md p-1"
          onBlur={handleUpdatePlantNote}
          placeholder="Notes about the plant"
        ></textarea>
        <br />
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
    </div>
  );
};

export default PlantPage;
