import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import styles from "./Costbreakup.module.css";
import Structure from "../Structure/Structure"

const CostBreakupComponent = () => {
  const location = useLocation();
  const { boqDetails, selectedPackage } = location.state || {}; // Retrieve passed state

  const [rows, setRows] = useState([
    { item: "Basement Area", calculatedArea: "", rate: "", cost: "" },
    { item: "Stilt", calculatedArea: "", rate: "", cost: "" },
    { item: "First Floor", calculatedArea: "", rate: "", cost: "" },
    { item: "Second Floor", calculatedArea: "", rate: "", cost: "" },
    { item: "Third Floor", calculatedArea: "", rate: "", cost: "" },
    { item: "Fourth Floor", calculatedArea: "", rate: "", cost: "" },
    { item: "Set Back Area", calculatedArea: "", rate: "", cost: "" },
    { item: "Balconies Area", calculatedArea: "", rate: "", cost: "" },
    { item: "Mumtry Area", calculatedArea: "", rate: "", cost: "" }
  ]);

  const [isSubmitted, setIsSubmitted] = useState(false);  // New state for submission tracking

  useEffect(() => {
    if (boqDetails && selectedPackage) {
      const updatedRows = rows.map((row) => {
        return {
          ...row,
          calculatedArea: boqDetails.calculatedArea || "",
        };
      });
      setRows(updatedRows);
    }
  }, [boqDetails, selectedPackage]);

  const handleChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;

    if (updatedRows[index].calculatedArea && updatedRows[index].rate) {
      updatedRows[index].cost = (
        parseFloat(updatedRows[index].calculatedArea) * parseFloat(updatedRows[index].rate)
      ).toFixed(2);
    } else {
      updatedRows[index].cost = "";
    }

    setRows(updatedRows);
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  return (
    <div className={styles.container}>
      <h2>{isSubmitted ? " " : "Cost Breakdown"}</h2>
      {!isSubmitted ? (
        <>
          <table className={styles.costTable}>
            <thead>
              <tr>
                <th>Item</th>
                <th>Calculated Area</th>
                <th>Rate</th>
                <th>Cost</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={index}>
                  <td>{row.item}</td>
                  <td>
                    <input
                      type="text"
                      value={row.calculatedArea}
                      readOnly
                      placeholder="Calculated Area"
                      className={styles.greyInput}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={row.rate}
                      onChange={(e) => handleChange(index, "rate", e.target.value)}
                      placeholder="Enter Rate"
                      className={styles.greyInput}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={row.cost}
                      readOnly
                      placeholder="Calculated Cost"
                      className={styles.greyInput}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className={styles.submitButton} onClick={handleSubmit}>Next</button>
        </>
      ) : (
        <Structure />
      )}
    </div>
  );
};

export default CostBreakupComponent;
