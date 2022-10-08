import { createRef, FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { formatTime, useQuery } from "../../utils";
import {
  removePlant,
  renamePlant,
  selectPlantList,
} from "../plantlist/plantListSlice";
import styles from "./plantPage.module.scss";

const PlantPage = (): JSX.Element => {
  const plantList = useAppSelector(selectPlantList);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const query = useQuery();
  const indexStr = query.get("index");
  const [now, setNow] = useState(new Date().valueOf() / 1000);
  const plantNameInputRef = createRef<HTMLInputElement>();

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date().valueOf() / 1000);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (indexStr === null) {
    return (
      <div className="page">
        <h1>404 Plant not found</h1>
      </div>
    );
  }

  const index = parseInt(indexStr);
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

  return (
    <div className="page">
      <form onSubmit={handleRenamePlant}>
        <input
          className={styles.plantName}
          ref={plantNameInputRef}
          defaultValue={plant.name}
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
          navigate("/plant/list");
        }}
      >
        Remove Plant
      </button>
    </div>
  );
};

export default PlantPage;
