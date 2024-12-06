import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Boqthree.module.css";
import { FaPlus } from "react-icons/fa"; // Importing the plus icon for adding more packages

const BoqThree = ({ packages, selectedImage, onBack, onEdit, onAddPackage }) => {
  const navigate = useNavigate();  // Initialize navigate function

  const handleSave = () => {
    navigate('/boq', { state: { packages } });  // Passing data using state
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.heading}>Construction Packages</h2>
        <button className={styles.addButton} onClick={onAddPackage}>
          <FaPlus className={styles.addIcon} /> Add More Packages
        </button>
      </div>

      <div className={styles.packagesList}>
        {packages.map((pkg, index) => (
          <div key={`package-${index}`} className={styles.packageBox}>
            <img
              src={selectedImage || pkg.imageUrl}
              alt="Package"
              className={styles.packageImage}
            />
            <div className={styles.packageDetails}>
              <h3 className={styles.packageName}>{pkg.packageName}</h3>
              <p className={styles.packagePrice}>Rs {pkg.price} /-</p>
              <button
                className={styles.viewMoreButton}
                onClick={() => onEdit(index)}
              >
                View More
              </button>
            </div>
          </div>
        ))}
      </div>

      <button type="button" className={styles.backButton} onClick={handleSave}>
        Save
      </button>
    </div>
  );
};

export default BoqThree;
