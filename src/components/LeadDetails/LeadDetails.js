import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import ActivityTimeline from './ActivityTimeline';
import Tasks from './Tasks';
import MoreDetails from './MoreDetails';
import './LeadDetails.css';
import LeadHeader from './LeadHeader';
import TestFitOut from './TestFitOut'; // Import TestFitOut component
import { jwtDecode } from 'jwt-decode';
import taskAddedSound from '../../assets/task-added.mp3'; // Adjust path as needed

const LeadDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const lead = location.state?.lead;

  if (!lead) {
    console.error('No lead data passed to LeadDetails');
    navigate('/leads');
    return null;
  }

  const [stepDetails, setStepDetails] = useState({
    Creation: '',
    Meeting: '',
    Quotation: '',
    'Test Fit Out': '',
    'Follow Up': '',
    Negotiation: '',
    Closure: '',
  });

  const [timelineActivities, setTimelineActivities] = useState([]);
  const [currentStep, setCurrentStep] = useState(3);
  const [activeTab, setActiveTab] = useState('details');
  const [activeActivityTab, setActiveActivityTab] = useState('logCall');
  const [isTimelineOpen, setIsTimelineOpen] = useState(true);
  const [selectedStep, setSelectedStep] = useState('Creation');
  const [completedSteps, setCompletedSteps] = useState([]);
  const [recapInput, setRecapInput] = useState('');
  const [taskInput, setTaskInput] = useState({ title: '', description: '', dueDate: '' });
  const [tasks, setTasks] = useState([]);

  const [inputErrors, setInputErrors] = useState({
    recapInput: false,
    title: false,
    description: false,
    dueDate: false,
  });

  // Function to play task added sound
  const playTaskAddedSound = () => {
    const audio = new Audio(taskAddedSound);
    audio.play();
  };

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Fetch tasks from API on component load
useEffect(() => {
  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/tasks/${lead._id}`);
      
      if (response.data && response.data.length === 0) {
        console.log('No tasks found for this lead');
        setTasks([]); // No tasks, but handle this gracefully
        return;
      }

      const sortedTasks = response.data.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));
      setTasks(sortedTasks); // Set the tasks fetched and sorted from the API

      // Create timeline activities from the tasks data
      const activities = sortedTasks.map(task => ({
        task: task.title, 
        user: task.assignedBy || 'Unknown', 
        time: new Date(task.postedDate).toLocaleString(), 
        avatar: `https://robohash.org/${task.assignedBy || 'unknown'}`,
      }));
      setTimelineActivities(activities); // Update timeline activities
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  fetchTasks();
}, [lead._id]);

// Fetch lead step details from API on component load and update state
useEffect(() => {
  const fetchStepDetails = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/lead-steps/${lead._id}`);
      if (response.data.leadSteps) {
        // Create an object to hold step details
        const stepData = {};
        response.data.leadSteps.forEach(step => {
          stepData[step.stepName] = step.stepDetails;
        });
        setStepDetails(stepData); // Set step details from backend into state
      }
    } catch (error) {
      console.error('Error fetching step details:', error);
    }
  };

  fetchStepDetails();
}, [lead._id]);



  // Fetch completed steps for the lead from backend
  useEffect(() => {
    const fetchLeadSteps = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/lead-steps/${lead._id}`);
        if (response.data.leadSteps) {
          // Extract completed step names and set them in state
          const completedStepNames = response.data.leadSteps.map(step => step.stepName);
          setCompletedSteps(completedStepNames); // Set completed steps
        }
      } catch (error) {
        console.error('Error fetching lead steps:', error);
      }
    };

    fetchLeadSteps();
  }, [lead._id]);

  // Function to update the status of a task
  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      // Update the task status in the backend
      await axios.put(`${API_BASE_URL}/tasks/update-task/${taskId}`, { status: newStatus });
  
      // Update the task status in the frontend
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task._id === taskId ? { ...task, status: newStatus } : task // Fixing the comparison here
        )
      );
  
      // Update the timeline when a task's status is changed
      setTimelineActivities(prevActivities =>
        prevActivities.map(activity =>
          activity.taskId === taskId ? { ...activity, status: newStatus } : activity
        )
      );
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };
  

  const debounce = (func, delay) => {
    let debounceTimer;
    return function (...args) {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => func(...args), delay);
    };
  };

  const saveStepDetails = useCallback(
    async (stepName, stepDetailsValue) => {
      const payload = {
        leadId: lead._id,
        stepName: stepName,
        stepDetails: stepDetailsValue,
      };

      try {
        const response = await axios.post(`${API_BASE_URL}/lead-steps`, payload);
        const result = response.data;
        if (result.message === 'Step data saved successfully') {
          if (!completedSteps.includes(stepName)) {
            setCompletedSteps([...completedSteps, stepName]);
          }
        }
      } catch (error) {
        console.error('Error saving step data:', error);
      }
    },
    [completedSteps, lead._id]
  );

  const handleInputChange = (e) => {
    const { value } = e.target;
    setStepDetails({ ...stepDetails, [selectedStep]: value });
    debounce(saveStepDetails(selectedStep, value), 1000);
  };

  // Handle Recap input
  const handleRecapInputChange = (e) => {
    setRecapInput(e.target.value);
    setInputErrors({ ...inputErrors, recapInput: false }); // Clear error when typing
  };

  // Add recap to the specific step's textarea
  const handleAddRecap = async () => {
    if (!recapInput.trim()) {
      setInputErrors({ ...inputErrors, recapInput: true }); // Mark input as error
      return;
    }
  
    // Use a default empty string for step details if undefined
    const updatedStepDetails = {
      ...stepDetails,
      [selectedStep]: `${stepDetails[selectedStep] || ''}\n${recapInput}`.trim(), // Append recap without prefixing 'undefined'
    };
    
    setStepDetails(updatedStepDetails);
  
    // Save updated step details to the server
    try {
      const response = await axios.post(`${API_BASE_URL}/lead-steps`, {
        leadId: lead._id,
        stepName: selectedStep,
        stepDetails: updatedStepDetails[selectedStep],
      });
  
      if (response.data.message === 'Step data saved successfully') {
        setRecapInput(''); // Clear input after successful save
      }
    } catch (error) {
      console.error('Error saving step details:', error);
    }
  };


  const handleTestFitOutSave = (data) => {
    if (data) {
      console.log('Saved Test Fit Out data:', data);
      // You can update the state or perform other actions with the returned data
      setStepDetails(prevDetails => ({
        ...prevDetails,
        'Test Fit Out': JSON.stringify(data.leadStep) // Update step details with the saved data
      }));
    } else {
      console.error('No data received from Test Fit Out save');
    }
  };
   

  // Handle new task input changes
  const handleTaskInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'dueDate') {
      setTaskInput({ ...taskInput, dueDate: value });
    }

    setTaskInput({ ...taskInput, [name]: value });
    setInputErrors({ ...inputErrors, [name]: false }); // Clear error when typing
  };

  // Add new task
  const handleAddTask = async () => {
    const { title, description, dueDate } = taskInput;
  
    if (!title.trim() || !description.trim() || !dueDate) {
      setInputErrors({
        title: !title.trim(),
        description: !description.trim(),
        dueDate: !dueDate,
      });
      return;
    }
  
    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      const decoded = jwtDecode(token); // Decode the token to extract user data
      const assignedBy = decoded.email; // Extract the email (or name) from the decoded token
  
      const payload = {
        leadId: lead._id,
        title,
        description,
        dueDate,
        assignedBy, // Use the logged-in user's email from the decoded token
        assignedTo: null, // Update if you have assigned users
        priority: 'Medium', // Default or fetch from UI
        status: 'Not Started', // Default or fetch from UI
      };
  
      const response = await axios.post(`${API_BASE_URL}/tasks`, payload, {
        headers: { Authorization: `Bearer ${token}` }, // Pass the token in headers
      });
  
      if (response.data) {
        setTasks((prevTasks) => [...prevTasks, response.data]); // Append the new task to the existing list

          // Play the sound when task is added
          playTaskAddedSound();
        // Add new task to the timeline activities
        setTimelineActivities((prevActivities) => [
          ...prevActivities,
          {
            task: response.data.title,
            user: response.data.assignedBy || 'Unknown',
            time: new Date(response.data.postedDate).toLocaleString(),
            avatar: `https://robohash.org/${response.data.assignedBy || 'unknown'}`,
          },
        ]);
  
        setTaskInput({ title: '', description: '', dueDate: '' }); // Clear input fields
      }
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const steps = [
    'Creation',
    'Meeting',
    'Quotation',
    'Test Fit Out',
    'Follow Up',
    'Negotiation',
    'Closure',
  ];

  const toggleTab = (tab) => {
    setActiveTab(tab);
  };

  const toggleTimeline = () => {
    setIsTimelineOpen(!isTimelineOpen);
  };

  const handleStepClick = (step) => {
    setSelectedStep(step);
  };

  // Function to check if a step is completed
  const isStepCompleted = (step) => {
    return completedSteps.includes(step);
  };

  // Function to mark a step as done
  const markStepAsDone = async () => {
    const stepDetailsValue = stepDetails[selectedStep] || ''; // Save empty stepDetails if nothing is entered

    try {
      const response = await axios.post(`${API_BASE_URL}/lead-steps`, {
        leadId: lead._id,
        stepName: selectedStep,
        stepDetails: stepDetailsValue,
      });

      if (response.data.message === 'Step data saved successfully') {
        if (!completedSteps.includes(selectedStep)) {
          setCompletedSteps([...completedSteps, selectedStep]); // Add the step to the completed list
        }

        // Automatically move to the next step
        const currentStepIndex = steps.indexOf(selectedStep);
        if (currentStepIndex < steps.length - 1) {
          setSelectedStep(steps[currentStepIndex + 1]);
        }
      }
    } catch (error) {
      console.error('Error saving step data:', error);
    }
  };
  

  return (
    <div className="details-page">
      <LeadHeader activeTab={activeTab} lead={lead} />

      <div className="arrow-progress-bar">
  {steps.map((step, index) => (
    <div
      key={index}
      className={`arrow-step 
        ${selectedStep === step ? 'filled' : 'empty'} 
        ${isStepCompleted(step) ? 'completed' : ''}`} 
      style={{
        backgroundColor: isStepCompleted(step) ? '#298050' : '', // Green background if completed
        color: isStepCompleted(step) ? 'white' : '', // White text if completed
      }}
      onClick={() => setSelectedStep(step)}
    >
      {step} 
      {isStepCompleted(step) && (
        <span
          className="completed-badge"
          style={{ color: 'white' }} // White color for the checkmark
        >
          ✓
        </span>
      )}
    </div>
  ))}
  <button className="mark-as-done-button" onClick={markStepAsDone}>
    Mark Done
  </button>
</div>
      <div className="content">
        <div className="left-section">
          <div className="activity">
            <h2>Activity</h2>
            <div className="activity-container">
              <div className="activity-tabs">
                <button
                  className={`activity-tab ${activeActivityTab === 'logCall' ? 'active' : ''}`}
                  onClick={() => setActiveActivityTab('logCall')}
                >
                  Log a call
                </button>
                <button
                  className={`activity-tab ${activeActivityTab === 'newTask' ? 'active' : ''}`}
                  onClick={() => setActiveActivityTab('newTask')}
                >
                  New task
                </button>
              </div>

              <div className="activity-form">
                {activeActivityTab === 'logCall' && (
                  <div className="log-call">
                    <input
                      type="text"
                      placeholder="Recap your call..."
                      className={`log-input ${inputErrors.recapInput ? 'error' : ''}`}
                      value={recapInput}
                      onChange={handleRecapInputChange} // Capture recap input
                    />
                    <button className="add-button" onClick={handleAddRecap}>
                      Add
                    </button>
                  </div>
                )}
                {activeActivityTab === 'newTask' && (
                  <div className="new-task-form">
                    <div className="task-row">
                      <input
                        type="text"
                        placeholder="Task title"
                        className={`log-input ${inputErrors.title ? 'error' : ''}`}
                        name="title"
                        maxLength="50"
                        value={taskInput.title}
                        onChange={handleTaskInputChange}
                      />
                      <input
                        type="date"
                        placeholder="Due date"
                        className={`log-input ${inputErrors.dueDate ? 'error' : ''}`}
                        name="dueDate"
                        min={new Date().toISOString().split('T')[0]} // Disable past dates
                        value={taskInput.dueDate}
                        onChange={handleTaskInputChange}
                      />
                    </div>
                    <textarea
                      placeholder="Task description"
                      className={`log-textarea ${inputErrors.description ? 'error' : ''}`}
                      name="description"
                      value={taskInput.description}
                      onChange={handleTaskInputChange}
                    ></textarea>
                    <button className="add-button" onClick={handleAddTask}>
                      Add Task
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Key Details Section */}
          <div className="key-details-container">
            {selectedStep === 'Creation' ? (
              <textarea
                rows="5"
                placeholder="Enter details for Creation..."
                className="meeting-textarea"
                value={stepDetails[selectedStep]}
                onChange={handleInputChange}
              ></textarea>
            ) : selectedStep === 'Test Fit Out' ? (
              <TestFitOut leadId={lead._id} onSave={handleTestFitOutSave} />

            ) : (
              <div className="step-details">
                <h3>{selectedStep} details</h3>
                <textarea
                  rows="5"
                  placeholder={`Enter details for ${selectedStep} here...`}
                  className="meeting-textarea"
                  value={stepDetails[selectedStep]}
                  onChange={handleInputChange}
                ></textarea>
              </div>
            )}
          </div>

          <Tasks tasks={tasks} updateTaskStatus={updateTaskStatus} /> {/* Pass tasks and updateTaskStatus to the Tasks component */}
        </div>

        <div className="right-section">
          <h2>&nbsp;</h2>

          <MoreDetails activeTab={activeTab} toggleTab={toggleTab} lead={lead} />

          <ActivityTimeline
            activities={timelineActivities}
            isTimelineOpen={isTimelineOpen}
            toggleTimeline={toggleTimeline}
          />
        </div>
      </div>
    </div>
  );
};

export default LeadDetails;
