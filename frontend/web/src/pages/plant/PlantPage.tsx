import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { selectPlantList } from "../plantlist/plantListSlice";
import styles from "./plantPage.module.scss";

const useQuery = () => {
  const { search } = useLocation();

  return useMemo(() => new URLSearchParams(search), [search]);
};

const PlantPage = (): JSX.Element => {
  const plantList = useAppSelector(selectPlantList);

  const query = useQuery();
  const indexStr = query.get("index");

  if (indexStr === null) {
    return <div>404</div>;
  }

  const index = parseInt(indexStr);
  const plant = plantList[index];

  if (plant === undefined && plantList.length === 0) {
    return <div>Loading ...</div>;
  }

  if (plant === undefined) {
    return <div>404 Plant not found</div>;
  }

  return (
    <div className="page">
      <h1 className={styles.plantName}>{plant.name}</h1>
      {plant.watering_interval}
    </div>
  );
};

export default PlantPage;
