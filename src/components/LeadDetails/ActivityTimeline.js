import React, { useState } from 'react';
import './LeadDetails.css'; // Import the CSS specific to the ActivityTimeline

// Function to parse date strings in the format 'DD/MM/YYYY, HH:mm:ss'
function parseDate(dateString) {
  console.log("Date String Received:", dateString); // Debugging

  const [datePart, timePart] = dateString.split(', ');
  const [day, month, year] = datePart.split('/');

  // Ensure all parts are available before proceeding
  if (!day || !month || !year || !timePart) {
    return 'Invalid date'; // Return early for malformed date formats
  }

  // Construct an ISO 8601 date format expected by JavaScript's Date object
  return `${year}-${month}-${day}T${timePart}`;
}

// Function to convert date to 'time ago' format
function timeAgo(dateString) {
  const date = new Date(parseDate(dateString)); // Parse the date using our function

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return 'Invalid date';
  }

  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) {
    return `${interval} year${interval > 1 ? 's' : ''} ago`;
  }

  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) {
    return `${interval} month${interval > 1 ? 's' : ''} ago`;
  }

  interval = Math.floor(seconds / 86400);
  if (interval >= 1) {
    return `${interval} day${interval > 1 ? 's' : ''} ago`;
  }

  interval = Math.floor(seconds / 3600);
  if (interval >= 1) {
    return `${interval} hour${interval > 1 ? 's' : ''} ago`;
  }

  interval = Math.floor(seconds / 60);
  if (interval >= 1) {
    return `${interval} minute${interval > 1 ? 's' : ''} ago`;
  }

  return `${Math.floor(seconds)} second${seconds > 1 ? 's' : ''} ago`;
}

// Function to extract the username from email format
function getUsername(user) {
  if (user && user.includes('@')) {
    return user.split('@')[0]; // Get the part before '@'
  }
  return user; // If not an email, return the original name
}

const ActivityTimeline = ({ activities, isTimelineOpen, toggleTimeline }) => {
  const [itemsToShow, setItemsToShow] = useState(5); // Initial number of items to show
  const [expandedItems, setExpandedItems] = useState({}); // To track expanded items

  // Function to toggle between showing more or fewer items
  const handleToggleTimeline = () => {
    if (isTimelineOpen) {
      setItemsToShow(activities.length); // Show all items
    } else {
      setItemsToShow(5); // Show only a few items
    }
    toggleTimeline(); // Toggle state from parent component
  };

  // Toggle expanded state for individual activities
  const handleToggleItem = (index) => {
    setExpandedItems((prevExpandedItems) => ({
      ...prevExpandedItems,
      [index]: !prevExpandedItems[index], // Toggle the current item
    }));
  };

  // Sort activities by date in descending order (latest activity first)
  const sortedActivities = [...activities].sort((a, b) => new Date(parseDate(b.time)) - new Date(parseDate(a.time)));

  return (
    <div className="activity-timeline">
      <h2>Activity Timeline</h2>
      <ul className="timeline-list">
        {sortedActivities.slice(0, itemsToShow).map((activity, index) => (
          <li key={index} className="timeline-item">
            <div className="timeline-content" onClick={() => handleToggleItem(index)}>
              <div className="task-summary">
                <span className={`timeline-icon ${expandedItems[index] ? 'arrow-down' : 'arrow-right'}`}>
                  ➤
                </span>
                <p className="default-task-title">Updated new task</p>
              </div>
              <img src={activity.avatar} alt="User" className="avatar" />
              {/* Use getUsername to display only the username if email format */}
              <span className="timeline-user">{getUsername(activity.user)}</span>
              <span className="timeline-time">{timeAgo(activity.time)}</span> {/* Convert time to 'time ago' format */}
              {expandedItems[index] && (
                <div className="task-details-expanded">
                  <p className="task-title">{activity.task}</p>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
      {/* Show toggle button if there are more than 5 activities */}
      {activities.length > 5 && (
        <button className="timeline-toggle" onClick={handleToggleTimeline}>
          {isTimelineOpen ? 'Show older' : 'Show fewer'}
        </button>
      )}
    </div>
  );
};

export default ActivityTimeline;
