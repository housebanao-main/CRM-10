import React, { useState } from "react";
import styles from "./Structure.module.css";
import dustbinIcon from "../../../assets/dustbin.png";
import structureIcon from "../../../assets/structure.png";
import drawingIcon from "../../../assets/drawing.png";

const Structure = () => {
  const [designText, setDesignText] = useState("");
  const [structureText, setStructureText] = useState("");

  const handleDeleteDesignText = () => {
    setDesignText("");
  };

  const handleDeleteStructureText = () => {
    setStructureText("");
  };

  const handleSaveDraft = () => {
    console.log("Draft Saved");
    alert("Draft Saved!");
  };

  const handleViewPDF = () => {
    console.log("View PDF");
    alert("View PDF clicked!");
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Package Items</h3>

      {/* Design and Drawings Section */}
      <div className={styles.row}>
        <div className={styles.labelContainer}>
          <img src={drawingIcon} alt="Drawing Icon" className={styles.icon} />
          <label className={styles.labelText}>Kitchen ( Item Name)</label>
          <button
            className={styles.deleteButton}
            onClick={handleDeleteDesignText}
          >
            <img src={dustbinIcon} alt="Delete" />
          </button>
        </div>
        <textarea
          value={designText}
          onChange={(e) => setDesignText(e.target.value)}
          className={styles.textArea}
          placeholder="Write about design and drawings..."
        />
      </div>

      {/* Structure Section */}
      <div className={styles.row}>
        <div className={styles.labelContainer}>
          <img src={structureIcon} alt="Structure Icon" className={styles.icon} />
          <label className={styles.labelText}>Bathroom ( Item Description)</label>
          <button
            className={styles.deleteButton}
            onClick={handleDeleteStructureText}
          >
            <img src={dustbinIcon} alt="Delete" />
          </button>
        </div>
        <textarea
          value={structureText}
          onChange={(e) => setStructureText(e.target.value)}
          className={styles.textArea}
          placeholder="Write about structure..."
        />
      </div>

      {/* Save Draft and View PDF Buttons */}
      <div className={styles.buttonContainer}>
        <button onClick={handleSaveDraft} className={styles.saveDraftButton}>
          Save Draft
        </button>
        <button onClick={handleViewPDF} className={styles.viewPDFButton}>
          View PDF
        </button>
      </div>
    </div>
  );
};

export default Structure;
