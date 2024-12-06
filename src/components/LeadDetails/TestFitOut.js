import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './LeadDetails.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const TestFitOut = ({ leadId, onSave }) => {
  const [floorPlanName, setFloorPlanName] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [existingFileName, setExistingFileName] = useState(''); // For showing the existing file
  const [uploadedFileUrl, setUploadedFileUrl] = useState(''); // For showing the uploaded file URL
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // For showing success message

  // Fetch the existing step data when the component loads
  useEffect(() => {
    const fetchStepData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/lead-steps/${leadId}`);
        const leadSteps = response.data.leadSteps;

        // Find the Test Fit Out step
        const testFitOutStep = leadSteps.find(step => step.stepName === 'Test Fit Out');
        if (testFitOutStep) {
          const stepDetails = JSON.parse(testFitOutStep.stepDetails);
          setFloorPlanName(stepDetails.floorPlanName || '');
          setDescription(stepDetails.description || '');
          setExistingFileName(stepDetails.fileName || '');
          setUploadedFileUrl(stepDetails.fileUrl || ''); // Set uploaded file URL if available
        }
      } catch (error) {
        console.error('Error fetching Test Fit Out data:', error);
      }
    };

    fetchStepData();
  }, [leadId]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Store the selected file
    setExistingFileName(''); // Clear the existing file name when a new file is selected
    setUploadedFileUrl(''); // Clear the uploaded file URL if a new file is selected
  };

  const handleSave = async () => {
    if (!floorPlanName || !description || (!file && !existingFileName)) {
      setError('All fields are required, including file.');
      return;
    }

    const formData = new FormData();
    formData.append('leadId', leadId);
    formData.append('stepName', 'Test Fit Out');
    formData.append('floorPlanName', floorPlanName);
    formData.append('description', description);

    if (file) {
      formData.append('file', file);
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/lead-steps/test-fit-out`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Test Fit Out saved successfully:', response.data);
      setSuccessMessage('Test Fit Out data saved successfully!'); // Show success message
      setUploadedFileUrl(response.data.leadStep.fileUrl || ''); // Update the uploaded file URL
      setExistingFileName(''); // Clear the existing file name after upload
      onSave(response.data); // Pass the saved data to the parent component
    } catch (error) {
      console.error('Error saving Test Fit Out:', error);
    }
  };

  return (
    <div className="test-fit-out-container">
      <div className="upload-section">
        <div className="file-drop-area">
          <div className="upload-icon">📁</div>
          <p>Drop file here</p>
          <span>OR</span>
          <button className="upload-button" onClick={() => document.getElementById('file-input').click()}>
            Upload file
          </button>
          <input
            type="file"
            id="file-input"
            className="file-input"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          {/* Show the existing file name or the uploaded file URL */}
          {uploadedFileUrl ? (
            <p className="existing-file-name">
              Uploaded file: <a href={uploadedFileUrl} target="_blank" rel="noopener noreferrer">View File</a>
            </p>
          ) : (
            existingFileName && (
              <p className="existing-file-name">
                Existing file: {existingFileName}
              </p>
            )
          )}
        </div>
      </div>

      <div className="basic-info">
        <h3>Basic Info</h3>
        <input
          type="text"
          placeholder="Floor plan name"
          className="input-field"
          value={floorPlanName}
          onChange={(e) => setFloorPlanName(e.target.value)}
        />
        <textarea
          placeholder="Description"
          rows="5"
          className="input-field"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>

        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>} {/* Show success message */}
        
        <button className="save-button" onClick={handleSave}>
          Save
        </button>
      </div>
    </div>
  );
};

export default TestFitOut;
