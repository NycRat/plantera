import { useEffect, useState } from "react";
import { useAppSelector } from "../../app/hooks";
import { formatTime, useQuery } from "../../utils";
import { selectPlantList } from "../plantlist/plantListSlice";
import styles from "./plantPage.module.scss";

const PlantPage = (): JSX.Element => {
  const plantList = useAppSelector(selectPlantList);

  const query = useQuery();
  const indexStr = query.get("index");
  const [now, setNow] = useState(new Date().valueOf() / 1000);

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

  return (
    <div className="page">
      <h1 className={styles.plantName}>{plant.name}</h1>
      <h2>Water every: {formatTime(plant.watering_interval)}</h2>
      <h2>
        Water in:{" "}
        {formatTime(plant.last_watered + plant.watering_interval - now)}
      </h2>
    </div>
  );
};

export default PlantPage;
