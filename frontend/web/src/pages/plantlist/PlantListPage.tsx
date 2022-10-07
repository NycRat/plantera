import { useNavigate } from "react-router-dom";
import { apiPostNewPlant } from "../../api/plantApi";
import { useAppSelector } from "../../app/hooks";
import styles from "./plantListPage.module.scss";
import { selectPlantList } from "./plantListSlice";

const PlantListPage = (): JSX.Element => {
  const navigate = useNavigate();
  const plantList = useAppSelector(selectPlantList);

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
      <button onClick={() => apiPostNewPlant("HAHA")}>NEW PLANT</button>
    </div>
  );
};
export default PlantListPage;
