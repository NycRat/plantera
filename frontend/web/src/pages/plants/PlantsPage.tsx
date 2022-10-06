import { useEffect, useState } from "react";
import { Cookies } from "react-cookie";
import { apiGetPlantList, apiPostNewPlant } from "./plantsApi";
import styles from "./plantPage.module.scss";

interface Plant {
  name: string;
  watering_interval: number;
}

const PlantsPage = (): JSX.Element => {
  const [plantList, setPlantList] = useState<Plant[]>([]);

  useEffect(() => {
    const ase = async () => {
      const cookies = new Cookies();
      const username = cookies.get("username");
      if (typeof username === "string") {
        const plants = await apiGetPlantList(username);
        console.log(plants);
        setPlantList(plants);
      }
    };
    ase();
  }, []);

  return (
    <div>
      <div className={styles.plantList}>
        <h1>Plants</h1>
        {plantList.map((plant, i) => (
          <div className={styles.plant} key={i}>
            <h2>{plant.name}</h2>
            {/* : {plant.watering_interval} */}
          </div>
        ))}
      </div>
      <button onClick={() => apiPostNewPlant("HAHA")}>NEW PLANT</button>
    </div>
  );
};
export default PlantsPage;
