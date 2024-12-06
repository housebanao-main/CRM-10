import React, { useState, useEffect } from 'react';
import './LeadDetails.css';
import Confetti from 'react-confetti';
import axios from 'axios';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Tasks = ({ tasks, updateTaskStatus }) => {
  const [isChecked, setIsChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Update the window size when the screen resizes
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const formatDate = (date) => {
    const parsedDate = new Date(date);
    return !isNaN(parsedDate)
      ? parsedDate.toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
        })
      : 'Invalid Date';
  };

  const handleCheckboxChange = async (taskId, currentStatus) => {
    const newStatus = currentStatus === 'Completed' ? 'Not Started' : 'Completed';
  
    setLoading(true); // Set loading state to true before the request
  
    console.log("Updating task with MongoDB _id:", taskId); // Use _id instead of custom taskId
  
    try {
      // Update the task status on the server using _id
      await axios.put(`${API_BASE_URL}/tasks/update-task/${taskId}`, { status: newStatus });
  
      // Update the task status in the frontend
      updateTaskStatus(taskId, newStatus);
  
      // Trigger confetti if task is marked as completed
      if (newStatus === 'Completed') {
        setIsChecked(true);
        setTimeout(() => {
          setIsChecked(false); // Stop the confetti after a short duration
        }, 3000);
      }
    } catch (error) {
      console.error('Error updating task status:', error); // Log the error
    } finally {
      setLoading(false); // Stop loading spinner after request completes
    }
  };
  
  const calculateDaysLeft = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 0) {
      return `${diffDays} days left`;
    } else if (diffDays === 0) {
      return 'Due today';
    } else {
      return `${Math.abs(diffDays)} days overdue`;
    }
  };

  // Sort tasks by `postedDate` or `dueDate` in descending order to show latest tasks first
  const sortedTasks = [...tasks].sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));

  return (
    <div className="tasks-container">
      {isChecked && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 9999,
          }}
        >
          <Confetti width={windowSize.width} height={windowSize.height} />
        </div>
      )}

      <h2>Tasks</h2>
      <div className="tasks-header">
        <span>Next steps</span>
        <span className="mark-as-done">Mark as done</span>
      </div>

      {loading ? (
        <div className="loading-spinner">Loading...</div>
      ) : (
        <div className="task-list">
          {Array.isArray(sortedTasks) && sortedTasks.length > 0 ? (
            sortedTasks.map((task) => (
              <div key={task._id} className="task-item">
                <div className="task-details">
                  <p className="task-title">{task.title}</p>
                  <p className="task-desc">{task.description}</p>
                  <p className="task-timestamp">
                    {task.status === 'Completed' ? 'Completed' : calculateDaysLeft(task.dueDate)}
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={task.status === 'Completed'}
                  onChange={() => handleCheckboxChange(task._id, task.status)} // Use _id
                />
              </div>
            ))
          ) : (
            <p>No tasks available</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Tasks;
