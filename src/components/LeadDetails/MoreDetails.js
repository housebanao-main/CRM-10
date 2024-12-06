import React, { useState, useRef, useEffect } from 'react';
import './LeadDetails.css'; // Import the CSS specific to the MoreDetails

const MoreDetails = ({ activeTab, toggleTab, lead }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editableLead, setEditableLead] = useState(lead);
  const firstInputRef = useRef(null); // To handle auto-focus on the first input field

  // Auto-focus on the first input field when 'Edit' is clicked
  useEffect(() => {
    if (isEditing && firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, [isEditing]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableLead({ ...editableLead, [name]: value });
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/leads/${editableLead._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editableLead),
      });

      if (response.ok) {
        console.log('Lead updated successfully');
        setIsEditing(false); // Exit editing mode
      } else {
        console.error('Failed to update lead');
      }
    } catch (error) {
      console.error('Error updating lead:', error);
    }
  };

  return (
    <div className="details-container">
      <div className="details-header">
        <div
          className={`details-tab ${activeTab === 'details' ? 'active' : ''}`}
          onClick={() => toggleTab('details')}
        >
          Details
        </div>
        <div
          className={`details-tab ${activeTab === 'more' ? 'active' : ''}`}
          onClick={() => toggleTab('more')}
        >
          More
        </div>
        {!isEditing ? (
          <button className="edit-button-right" onClick={handleEditClick}>
            Edit
          </button>
        ) : (
          <button className="edit-button-right" onClick={handleSave}>
            Save
          </button>
        )}
      </div>

      <div className="details-content">
        {activeTab === 'details' && editableLead && (
          <div className="details-grid">
            <div>
              <p className="label">POC Details</p>
              {isEditing ? (
                <>
                  <input
                    type="text"
                    name="name"
                    value={editableLead.name}
                    onChange={handleInputChange}
                    className="animated-input"
                    ref={firstInputRef} // Auto-focus on this input
                  />
                  <input
                    type="text"
                    name="number"
                    value={editableLead.number}
                    onChange={handleInputChange}
                    className="animated-input"
                  />
                  <input
                    type="text"
                    name="email"
                    value={editableLead.email}
                    onChange={handleInputChange}
                    className="animated-input"
                  />
                </>
              ) : (
                <>
                  <p>{editableLead.name}</p>
                  <p>
                    <a href={`tel:${editableLead.number}`}>
                      {editableLead.number}
                    </a>
                  </p>
                  <p>
                    <a href={`mailto:${editableLead.email}`}>
                      {editableLead.email}
                    </a>
                  </p>
                </>
              )}
            </div>
            <div>
              <p className="label">Location</p>
              {isEditing ? (
                <input
                  type="text"
                  name="city"
                  value={editableLead.city}
                  onChange={handleInputChange}
                  className="animated-input"
                />
              ) : (
                <p>{editableLead.city}</p>
              )}
            </div>
            <div>
              <p className="label">Address</p>
              {isEditing ? (
                <>
                  <input
                    type="text"
                    name="addressLine1"
                    value={editableLead.addressLine1}
                    onChange={handleInputChange}
                    className="animated-input"
                  />
                  <input
                    type="text"
                    name="addressLine2"
                    value={editableLead.addressLine2}
                    onChange={handleInputChange}
                    className="animated-input"
                  />
                </>
              ) : (
                <>
                  <p>{editableLead.addressLine1}</p>
                  <p>{editableLead.addressLine2}</p>
                </>
              )}
            </div>
            <div>
              <p className="label">Plot Size</p>
              {isEditing ? (
                <input
                  type="text"
                  name="plotSize"
                  value={editableLead.plotSize || ''}
                  onChange={handleInputChange}
                  className="animated-input"
                />
              ) : (
                <p>{editableLead.plotSize || 'N/A'}</p>
              )}
            </div>
            <div>
              <p className="label">Budget</p>
              {isEditing ? (
                <input
                  type="text"
                  name="budget"
                  value={editableLead.budget || ''}
                  onChange={handleInputChange}
                  className="animated-input"
                />
              ) : (
                <p>{editableLead.budget || 'N/A'}</p>
              )}
            </div>
            <div>
              <p className="label">Type</p>
              {isEditing ? (
                <input
                  type="text"
                  name="type"
                  value={editableLead.type || ''}
                  onChange={handleInputChange}
                  className="animated-input"
                />
              ) : (
                <p>{editableLead.type || 'N/A'}</p>
              )}
            </div>
            <div>
              <p className="label">Floor Requirement</p>
              {isEditing ? (
                <input
                  type="text"
                  name="floors"
                  value={editableLead.floors || ''}
                  onChange={handleInputChange}
                  className="animated-input"
                />
              ) : (
                <p>{editableLead.floors || 'N/A'}</p>
              )}
            </div>
            <div>
              <p className="label">Room Requirement</p>
              {isEditing ? (
                <input
                  type="text"
                  name="rooms"
                  value={editableLead.rooms || ''}
                  onChange={handleInputChange}
                  className="animated-input"
                />
              ) : (
                <p>{editableLead.rooms || 'N/A'}</p>
              )}
            </div>
            <div>
              <p className="label">Start Date</p>
              {isEditing ? (
                <input
                  type="text"
                  name="dayToStart"
                  value={editableLead.dayToStart || ''}
                  onChange={handleInputChange}
                  className="animated-input"
                />
              ) : (
                <p>{editableLead.dayToStart || 'N/A'}</p>
              )}
            </div>
            <div>
              <p className="label">Priority</p>
              {isEditing ? (
                <select
                  name="priority"
                  value={editableLead.priority}
                  onChange={handleInputChange}
                  className="animated-input"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              ) : (
                <p>{editableLead.priority}</p>
              )}
            </div>
            <div>
              <p className="label">Status</p>
              {isEditing ? (
                <select
                  name="status"
                  value={editableLead.status}
                  onChange={handleInputChange}
                  className="animated-input"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Boq Sent">Boq Sent</option>
                  <option value="Deal Closed">Deal Closed</option>
                  <option value="Meeting Done">Meeting Done</option>
                </select>
              ) : (
                <p>{editableLead.status}</p>
              )}
            </div>
          </div>
        )}
        {activeTab === 'more' && editableLead && (
          <div className="details-grid">
            <div>
              <p className="label">Additional Information</p>
              {isEditing ? (
                <textarea
                  name="extraInfo"
                  value={editableLead.extraInfo || ''}
                  onChange={handleInputChange}
                  className="animated-input"
                />
              ) : (
                <p>{editableLead.extraInfo || 'No additional details available.'}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MoreDetails;
