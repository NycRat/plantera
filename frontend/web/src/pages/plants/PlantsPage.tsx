import { useEffect, useState } from "react";
import { apiGetPlantList } from "./plantsApi";

interface Plant {
  name: string;
  wateringInterval: number;
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
          {plant.name}: {plant.wateringInterval}
        </div>
      ))}
    </div>
  );
};

export default PlantsPage;
