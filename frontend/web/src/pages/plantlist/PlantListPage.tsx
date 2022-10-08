import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import Plant from "../../models/plant";
import styles from "./plantListPage.module.scss";
import { addPlant, selectPlantList } from "./plantListSlice";

const PlantListPage = (): JSX.Element => {
  const navigate = useNavigate();
  const plantList = useAppSelector(selectPlantList);
  const dispatch = useAppDispatch();

  const defaultNewPlant: Plant = {
    name: "GREAT PLANT XD",
    last_watered: 0,
    watering_interval: 30,
  };

  return (
    <div>
      <div className={styles.plantList}>
        <h1>Plants</h1>
        {plantList.map((plant, i) => (
          <div
            className={styles.plant}
            key={i}
            onClick={() => {
              navigate(`/plant?index=${i}`);
            }}
          >
            <h2>{plant.name}</h2>
          </div>
        ))}
      </div>
      <button onClick={() => dispatch(addPlant(defaultNewPlant))}>
        NEW PLANT
      </button>
    </div>
  );
};
export default PlantListPage;
