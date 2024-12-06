import React, { useState } from "react";
import styles from "./Boqtwo.module.css";
import { FaPlus } from "react-icons/fa";

const BoqTwo = ({ onBack, onSave, defaultCategory, onImageSelect, initialPackages = [] }) => {
  const [packages, setPackages] = useState(
    initialPackages.length > 0 ? initialPackages : [
      { packageName: defaultCategory || "", price: "", packageDetails: "" },
    ]
  );

  const [items, setItems] = useState([
    { itemName: "", itemDetails: "", uploadedImage: null },
  ]);

  const handlePackageChange = (index, field, value) => {
    const updatedPackages = [...packages];
    updatedPackages[index][field] = value;
    setPackages(updatedPackages);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      onImageSelect(imageUrl);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (packages.some(pkg => !pkg.packageName || !pkg.price || !pkg.packageDetails)) {
      alert("Please fill in all the required fields!");
      return;
    }
    onSave({ packages });
  };

  const handleAddPackage = () => {
    setPackages([...packages, { packageName: "", price: "", packageDetails: "" }]);
  };

  return (
    <form className={styles.boqTwoForm} onSubmit={handleSubmit}>
      <div className={styles.boqTwoHeader}>
        <div className={styles.boqTwoLeftHeader}>
          <span className={styles.boqTwoBackIcon} onClick={onBack}>←</span>
          <h2 className={styles.boqTwoHeadingText}>Add Packages</h2>
        </div>
        <button type="button" className={styles.boqTwoAddButton} onClick={handleAddPackage}>
          <FaPlus /> Add More Packages
        </button>
      </div>

      {packages.map((pkg, index) => (
        <div key={`package-${index}`} className={styles.boqTwoPackageRow}>
          <div className={styles.boqTwoInputRow}>
            <div className={styles.boqTwoInputGroup}>
              <label className={styles.boqTwoLabel}>Package Name</label>
              <input
                type="text"
                value={pkg.packageName}
                onChange={(e) => handlePackageChange(index, "packageName", e.target.value)}
                className={styles.boqTwoInput}
                placeholder="Enter package name"
              />
            </div>
            <div className={styles.boqTwoInputGroup}>
              <label className={styles.boqTwoLabel}>Price/Price Range</label>
              <input
                type="number"
                value={pkg.price}
                onChange={(e) => handlePackageChange(index, "price", e.target.value)}
                className={styles.boqTwoInput}
                placeholder="In Rupees"
              />
            </div>
          </div>

          <div className={styles.boqTwoTextAreaGroup}>
            <label className={styles.boqTwoLabels}>Package Details</label>
            <textarea
              value={pkg.packageDetails}
              onChange={(e) => handlePackageChange(index, "packageDetails", e.target.value)}
              className={styles.boqTwoTextArea}
              placeholder="Description"
            />
          </div>

          <div className={styles.boqTwoInputRow}>
            <div className={styles.boqTwoInputGroup}>
              <label className={styles.boqTwoLabel}>Item Name</label>
              <input
                type="text"
                value={items[index]?.itemName || ""}
                onChange={(e) => {
                  const updatedItems = [...items];
                  updatedItems[index] = {
                    ...updatedItems[index],
                    itemName: e.target.value
                  };
                  setItems(updatedItems);
                }}
                className={styles.boqTwoInput}
                placeholder="Enter item name"
              />
            </div>
            <div className={styles.boqTwoInputGroup}>
              <label className={styles.boqTwoLabel}>Upload Image</label>
              <input
                type="file"
                onChange={handleImageUpload}
                className={styles.boqTwoInput}
                accept="image/*"
              />
            </div>
          </div>

          <div className={styles.boqTwoTextAreaGroup}>
            <label className={styles.boqTwoLabels}>Item Details</label>
            <textarea
              value={items[index]?.itemDetails || ""}
              onChange={(e) => {
                const updatedItems = [...items];
                updatedItems[index] = {
                  ...updatedItems[index],
                  itemDetails: e.target.value
                };
                setItems(updatedItems);
              }}
              className={styles.boqTwoTextArea}
              placeholder="Description"
            />
          </div>
        </div>
      ))}

      <div className={styles.boqTwoInputRow}>
        <button type="submit" className={styles.boqTwoSaveButton}>Save</button>
      </div>
    </form>
  );
};

export default BoqTwo;
