import { useEffect, useState } from "react";
import { apiGetPlantList } from "./plantsApi";

interface Plant {
  name: string;
  watering_interval: number;
}

const PlantsPage = (): JSX.Element => {
  const [plantList, setPlantList] = useState<Plant[]>([]);

  useEffect(() => {
    const ase = async () => {
      const plants = await apiGetPlantList("Jake");
      console.log(plants);
      setPlantList(plants);
    };
    ase();
  }, []);
  return (
    <div>
      {plantList.map((plant, i) => (
        <div key={i}>
          {plant.name}: {plant.watering_interval}
        </div>
      ))}
    </div>
  );
};

export default PlantsPage;
