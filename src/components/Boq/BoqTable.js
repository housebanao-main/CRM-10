import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./BoqTable.module.css"; // Assuming styles are similar to your `Boqthree` styles

const BoqTable = ({ packages }) => {
  const navigate = useNavigate();
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [boqDetails, setBoqDetails] = useState({
    boqName: "",
    type: "",
    createdOn: new Date().toLocaleDateString(),
    customerName: "",
    totalArea: "",
    percentage: "",
    floors: "",
    calculatedArea: "" // Add calculatedArea here
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Update the state based on the input change
    setBoqDetails((prev) => {
      const newBoqDetails = {
        ...prev,
        [name]: value,
      };

      // If the total area or percentage is changed, calculate the calculated area
      if (name === "totalArea" || name === "percentage") {
        const calculatedArea = (parseFloat(newBoqDetails.totalArea) * parseFloat(newBoqDetails.percentage) / 100).toFixed(2);
        newBoqDetails.calculatedArea = calculatedArea;
      }

      return newBoqDetails;
    });
  };

  const handleNext = () => {
    if (selectedPackage) {
      navigate("/costbreakup", {
        state: { boqDetails, selectedPackage },
      });
    } else {
      alert("Please select a package.");
    }
  };

  return (
    <div>
      <h2 className={styles.heading}>Choose Your Package</h2>
      <div className={styles.packageSelection}>
        <div className={styles.packagesList}>
          {packages.map((pkg, index) => (
            <div
              key={index}
              className={styles.packageBox}
              onClick={() => setSelectedPackage(pkg)}
              style={{
                border: selectedPackage === pkg ? " " : "none",
              }}
            >
              <img src={pkg.imageUrl} alt={pkg.packageName} className={styles.packageImage} />
              <div className={styles.packageDetails}>
                <h3 className={styles.packageName}>{pkg.packageName}</h3>
                <p className={styles.packagePrice}>Rs {pkg.price} /-</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <hr className={styles.horizontalLine} />

      <div className={styles.inputRow}>
        <div className={styles.inputGroup}>
          <label>BOQ Name</label>
          <input
            type="text"
            name="boqName"
            value={boqDetails.boqName}
            onChange={handleInputChange}
            pattern="[A-Za-z\s]+"
            placeholder="Enter BOQ Name"
          />
        </div>
        <div className={styles.inputGroup}>
          <label>Type</label>
          <input
            type="text"
            name="type"
            value={boqDetails.type}
            onChange={handleInputChange}
            placeholder="Enter Type"
          />
        </div>
        <div className={styles.inputGroup}>
          <label>Created On</label>
          <input
            type="text"
            name="createdOn"
            value={boqDetails.createdOn}
            disabled
            placeholder="Today's Date"
          />
        </div>
        <div className={styles.inputGroup}>
          <label>Customer Name</label>
          <input
            type="text"
            name="customerName"
            value={boqDetails.customerName}
            onChange={handleInputChange}
            pattern="[A-Za-z\s]+"
            placeholder="Enter Customer Name"
          />
        </div>
      </div>

      <div className={styles.inputRow}>
        <div className={styles.inputGroup}>
          <label>Total Area</label>
          <input
            type="number"
            name="totalArea"
            value={boqDetails.totalArea}
            onChange={handleInputChange}
            placeholder="Enter Total Area"
            min="0"
          />
        </div>
        <div className={styles.inputGroup}>
          <label>% Area</label>
          <input
            type="number"
            name="percentage"
            value={boqDetails.percentage}
            onChange={handleInputChange}
            placeholder="Enter Percentage"
            min="0"
          />
        </div>
        <div className={styles.inputGroup}>
          <label>No. of Floors</label>
          <input
            type="number"
            name="floors"
            value={boqDetails.floors}
            onChange={handleInputChange}
            placeholder="Enter No. of Floors"
            min="1"
          />
        </div>
        <div className={styles.inputGroup}>
          <label>Custom</label>
          <input
            type="text"
            name="custom"
            value={boqDetails.custom}
            onChange={handleInputChange}
            pattern="[A-Za-z\s]+"
            placeholder="Enter Custom"
          />
        </div>
      </div>

      <button onClick={handleNext} className={styles.nextButton}>
        Next
      </button>
    </div>
  );
};

export default BoqTable;
