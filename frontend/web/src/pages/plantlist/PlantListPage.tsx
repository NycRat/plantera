import { createRef, FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiPostPlantImage } from "../../api/plantApi";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import Plant from "../../models/plant";
import styles from "./plantListPage.module.scss";
import { addPlant, selectPlantList } from "./plantListSlice";

const PlantListPage = (): JSX.Element => {
  const navigate = useNavigate();
  const plantList = useAppSelector(selectPlantList);
  const dispatch = useAppDispatch();
  const plantImageRef = createRef<HTMLInputElement>();
  const [preview, setPreview] = useState("");

  const defaultNewPlant: Plant = {
    name: "GREAT PLANT XD",
    last_watered: 0,
    watering_interval: 30,
  };

  const handleCreatePlant = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(addPlant(defaultNewPlant));

    if (plantImageRef.current === null) {
      return;
    }

    let reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setPreview(reader.result);
        apiPostPlantImage(reader.result, 0);
      }
      console.log(reader.result);
    };

    if (plantImageRef.current.files !== null) {
      const image = plantImageRef.current.files[0];
      if (image !== undefined) {
        /* reader.readAsBinaryString(plantImageRef.current.files[0]); */
        reader.readAsDataURL(plantImageRef.current.files[0]);
      }
    }
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
      <form onSubmit={handleCreatePlant}>
        <input type={"file"} ref={plantImageRef} />
        <input type={"submit"} value={"NEW PLANT"} />
      </form>
      <img src={preview} alt={"haha"} />
    </div>
  );
};
export default PlantListPage;
