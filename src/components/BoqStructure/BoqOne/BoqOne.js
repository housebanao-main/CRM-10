import React from "react";
import styles from "./Boqone.module.css";
import sampleImage from "../../../assets/packagegirl.png";

const BoqOne = ({ onSelectCategory }) => {
  return (
    <form className={styles.form}>
      <h2 className={styles.heading}>Choose Your Category</h2>
      <div className={styles.categories}>
        <div className={styles.row}>
          <div
            className={styles.box}
            onClick={() => onSelectCategory("Construction")}
          >
            Construction
          </div>
          <div
            className={styles.box}
            onClick={() => onSelectCategory("Home Interior")}
          >
            Home Interior
          </div>
        </div>
        <div className={styles.row}>
          <div
            className={styles.box}
            onClick={() => onSelectCategory("Construction + Interior")}
          >
            Construction + Interior
          </div>
          <div
            className={styles.box}
            onClick={() => onSelectCategory("Office Interior")}
          >
            Office Interior
          </div>
        </div>
      </div>
      <div className={styles.imageContainer}>
        <img src={sampleImage} alt="Sample" className={styles.image} />
      </div>
      <h3 className={styles.subheading}>No Packages Found</h3>
      <button
        type="button"
        className={styles.button}
        onClick={() => onSelectCategory("Create New")}
      >
        Create New
      </button>
    </form>
  );
};

export default BoqOne;
