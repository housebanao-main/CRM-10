import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import styles from '../Tables.module.css';
import { useNavigate } from 'react-router-dom';

function LeadTable() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(initialFormData());
  const [leads, setLeads] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [expandedLeadId, setExpandedLeadId] = useState(null);
  const [permissions, setPermissions] = useState({});
  const [role, setRole] = useState('user');
  const [editingLeadId, setEditingLeadId] = useState(null);
  
  // Add state to track the current page and if more leads are available
  const [page, setPage] = useState(1); // Page state initialized to 1
  const [hasMoreLeads, setHasMoreLeads] = useState(true); // Track if more leads are available


  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const storedPermissions = localStorage.getItem('permissions');
    const storedRole = localStorage.getItem('role');
    if (storedPermissions) {
      setPermissions(JSON.parse(storedPermissions));
    }
    if (storedRole) {
      setRole(storedRole);
    }

    // Fetch MongoDB and Facebook leads initially
    fetchData(page);

    fetchUsers();

    // Set up scroll event listener for infinite scrolling
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [page]);

  const fetchData = async (page) => {
    try {
      // Fetch data from MongoDB and Facebook in parallel
      const [mongoLeadsResponse, fbLeadsResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/leads?page=${page}&limit=20`), // MongoDB leads with pagination
        fetchFacebookLeads(), // Facebook leads (you might not need pagination here)
      ]);

      // Process MongoDB leads
      const mongoLeads = mongoLeadsResponse.data.map(lead => ({
        ...lead,
        assignedUser: null, // Add assignedUser field
        userSearchQuery: '', // Add user search query field
        filteredUsers: [], // Add filtered users field
      }));

      // Process Facebook leads
      const fbLeads = fbLeadsResponse.map(lead => ({
        leadId: lead.id,
        name: lead.field_data.find(field => field.name === 'full_name')?.values[0] || 'N/A',
        email: lead.field_data.find(field => field.name === 'email')?.values[0] || 'N/A',
        number: lead.field_data.find(field => field.name === 'phone_number')?.values[0] || 'N/A',
        city: 'Unknown',
        type: 'Facebook',
        priority: 'Medium',
        status: 'Active',
        assignedUser: null,
        userSearchQuery: '',
        filteredUsers: []
      }));

      // Combine MongoDB and Facebook leads
      const combinedLeads = [...mongoLeads, ...fbLeads];

      // Sort leads by createdDate in descending order (latest first)
      combinedLeads.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));

      // Append new leads to the existing state
      setLeads((prevLeads) => [...prevLeads, ...combinedLeads]);

      // Check if there are more leads to load
      if (combinedLeads.length < 20) {
        setHasMoreLeads(false); // No more leads available
      }
    } catch (error) {
      console.error('Error fetching the leads:', error);
    }
  };

  const fetchFacebookLeads = async () => {
    const adId = '120211133458060601'; // Your actual ad ID
    const accessToken = 'YOUR_ACCESS_TOKEN'; // Your new access token

    if (!adId || !accessToken) {
      console.error('Ad ID or Access Token is missing');
      return [];
    }

    const fbApiUrl = `https://graph.facebook.com/v12.0/${adId}/leads?access_token=${accessToken}`;

    try {
      const response = await axios.get(fbApiUrl);
      console.log('Facebook leads:', response.data); // Log Facebook leads
      return response.data.data;
    } catch (error) {
      if (error.response) {
        console.error('Error fetching Facebook leads:', error.response.data);
      } else {
        console.error('Error fetching Facebook leads:', error.message);
      }
      return [];
    }
  };

  // Infinite scrolling: load more leads when reaching the bottom of the page
  const handleScroll = () => {
    if (window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight) {
      if (hasMoreLeads) {
        setPage((prevPage) => prevPage + 1); // Load next page
      }
    }
  };
  
  

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users`);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching the users!', error);
    }
  };

  const handleEditLead = (lead) => {
    navigate('/creation', { state: { lead } });
  };

  const sendEmail = async (user, lead) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/email/send-email`, { user, lead });
      console.log(response.data.message);
    } catch (error) {
      console.error('Failed to send email:', error.response ? error.response.data.message : error.message);
    }
  };

  const handleUserSelect = (user, leadId) => {
    const updatedLeads = leads.map(lead =>
      lead._id === leadId
        ? { ...lead, assignedUser: user, userSearchQuery: '', filteredUsers: [] }
        : lead
    );
    setLeads(updatedLeads);

    const selectedLead = leads.find(lead => lead._id === leadId);
    sendEmail(user, selectedLead);
  };

  const openModal = (lead = null) => {
    if (lead) {
      setFormData(lead);
      setEditingLeadId(lead._id);
    } else {
      setFormData(initialFormData());
      setEditingLeadId(null);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormError('');
    setErrors({});
    setCurrentStep(1);
  };

  const handleUserSearchChange = (e, leadId) => {
    const query = e.target.value;
    setLeads(leads.map(lead =>
      lead._id === leadId
        ? {
            ...lead,
            userSearchQuery: query,
            filteredUsers: users.filter(user =>
              user.name.toLowerCase().includes(query.toLowerCase())
            ),
          }
        : lead
    ));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const validateForm = () => {
    let tempErrors = {};
    if (currentStep === 1) {
      if (!formData.type) tempErrors.type = 'Type is required';
      if (!formData.pincode) tempErrors.pincode = 'Pincode is required';
      if (!formData.name) tempErrors.name = 'Name is required';
      if (!formData.number) tempErrors.number = 'Number is required';
      if (!formData.email) tempErrors.email = 'Email is required';
    } else if (currentStep === 2) {
      if (!formData.plotSize) tempErrors.plotSize = 'Plot Size is required';
      if (!formData.floors) tempErrors.floors = 'Floors requirement is required';
      if (!formData.rooms) tempErrors.rooms = 'Rooms requirement is required';
      if (!formData.budget) tempErrors.budget = 'Budget is required';
      if (!formData.dayToStart) tempErrors.dayToStart = 'Day to start is required';
      if (formData.type === 'Interior') {
        if (!formData.interiorType) tempErrors.interiorType = 'Interior Type is required';
        if (!formData.subType) tempErrors.subType = 'Sub Type is required';
      }
    } else if (currentStep === 3) {
      if (!formData.addressLine1) tempErrors.addressLine1 = 'Address Line 1 is required';
      if (!formData.addressLine2) tempErrors.addressLine2 = 'Address Line 2 is required';
      if (!formData.pincode) tempErrors.pincode = 'Pincode is required';
      if (!formData.country) tempErrors.country = 'Country is required';
      if (!formData.city) tempErrors.city = 'City is required';
      if (!formData.state) tempErrors.state = 'State is required';
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (editingLeadId) {
        await axios.put(`${API_BASE_URL}/leads/${editingLeadId}`, formData);
      } else {
        await axios.post(`${API_BASE_URL}/leads`, formData);
      }

      fetchData();
      closeModal();
      setFormData(initialFormData());
    } catch (error) {
      console.error('Error adding the lead!', error);
      setFormError('There was an error adding the lead. Please try again.');
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const nextStep = () => {
    if (!validateForm()) return;
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const toggleExpand = (leadId) => {
    setExpandedLeadId(expandedLeadId === leadId ? null : leadId);
  };

  const handlePriorityChange = async (e, lead) => {
    const { value } = e.target;
    try {
      await axios.patch(`${API_BASE_URL}/leads/${lead._id}/priority`, { priority: value });
      setLeads(leads.map(l => l._id === lead._id ? { ...l, priority: value } : l));
    } catch (error) {
      console.error('Error updating the lead priority!', error);
    }
  };

  const handleStatusChange = async (e, lead) => {
    const { value } = e.target;
    try {
      await axios.patch(`${API_BASE_URL}/leads/${lead._id}/status`, { status: value });
      setLeads(leads.map(l => l._id === lead._id ? { ...l, status: value } : l));
    } catch (error) {
      console.error('Error updating the lead status!', error);
    }
  };

  const handleLeadClick = (lead) => {
    navigate('/creation', { state: { lead } });
  };

  const filteredLeads = leads.filter(lead =>
    lead.leadId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'High':
        return styles.highPriority;
      case 'Medium':
        return styles.mediumPriority;
      case 'Low':
        return styles.lowPriority;
      default:
        return '';
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Active':
        return styles.activeStatus;
      case 'Inactive':
        return styles.inactiveStatus;
      case 'Boq Sent':
        return styles.boqSentStatus;
      case 'Deal Closed':
        return styles.dealClosedStatus;
      case 'Meeting Done':
        return styles.meetingDoneStatus;
      default:
        return '';
    }
  };

  return (
    <div className={styles.tableContainer}>
      <div className={styles.layoutBar}>
        <div className={styles.searchBar}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search leads"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        {(role === 'admin' || permissions.lead?.editor) && (
          <button type="button" onClick={() => openModal()} className={styles.addCustomerButton}>+ Add Leads</button>
        )}
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Lead ID</th>
            <th>POC</th>
            <th>Location</th>
            <th>Type</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {filteredLeads.map((lead, index) => (
            <tr
              key={index}
              onClick={() => handleLeadClick(lead)} // Navigate to CreationPage when row is clicked
              className={`${styles.row} ${styles[getPriorityClass(lead.priority)]} ${styles[getStatusClass(lead.status)]}`}
            >
              <td>{lead.leadId}</td>
              <td>
                <div>
                  <strong>{lead.name}</strong><br />
                  {lead.number}<br />
                  {lead.email}
                </div>
              </td>
              <td>{lead.city}</td>
              <td>{lead.type}</td>
              <td>
                {(role === 'admin' || permissions.lead?.editor) ? (
                  <select value={lead.priority} onClick={(e) => e.stopPropagation()} onChange={(e) => handlePriorityChange(e, lead)} className={styles.actionSelect}>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                ) : (
                  'N/A'
                )}
              </td>
              <td>
                {(role === 'admin' || permissions.lead?.editor) ? (
                  <select value={lead.status} onClick={(e) => e.stopPropagation()} onChange={(e) => handleStatusChange(e, lead)} className={styles.actionSelect}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Boq Sent">Boq Sent</option>
                    <option value="Deal Closed">Deal Closed</option>
                    <option value="Meeting Done">Meeting Done</option>
                  </select>
                ) : (
                  'N/A'
                )}
              </td>
              <td>
                <button onClick={(e) => { e.stopPropagation(); openModal(lead); }} className={styles.editButton}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Add Lead Modal"
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        <div className={styles.modalContent}>
          <h2>{editingLeadId ? 'Edit Lead' : 'Add Lead'}</h2>
          {formError && <div className={styles.formError}>{formError}</div>}
          <form className={styles.form} onSubmit={handleSubmit}>
            {currentStep === 1 && (
              <>
                <SelectField
                  id="type"
                  name="type"
                  label="Type"
                  value={formData.type}
                  onChange={handleChange}
                  options={[
                    { value: '', label: 'Select type' },
                    { value: 'Construction', label: 'Construction' },
                    { value: 'Interior', label: 'Interior' },
                    { value: 'Interior + Construction', label: 'Interior + Construction' },
                  ]}
                  error={errors.type}
                />
<TextField
  id="name"
  name="name"
  label="Name"
  placeholder="Enter name"
  value={formData.name}
  onChange={(e) => {
    const regex = /^[a-zA-Z\s]*$/; // Only allows letters and spaces
    if (regex.test(e.target.value)) {
      handleChange(e);
    }
  }}
  error={errors.name}
/>

<TextField
  id="number"
  name="number"
  label="Number"
  placeholder="Enter number"
  type="text"  // Using 'text' to allow custom validation for numeric input
  value={formData.number}
  onChange={(e) => {
    const regex = /^[0-9]*$/; // Only allows numbers
    if (regex.test(e.target.value)) {
      handleChange(e);
    }
  }}
  error={errors.number}
/>
                <TextField
                  id="email"
                  name="email"
                  label="Email"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                />
                <TextField
                  id="pincode"
                  name="pincode"
                  label="Pincode"
                  placeholder="Enter pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  error={errors.pincode}
                />
                <SelectField
                  id="priority"
                  name="priority"
                  label="Priority"
                  value={formData.priority}
                  onChange={handleChange}
                  options={[
                    { value: 'High', label: 'High' },
                    { value: 'Medium', label: 'Medium' },
                    { value: 'Low', label: 'Low' },
                  ]}
                  error={errors.priority}
                />
                <div className={styles.formGroupBottom}>
                  <button type="button" className={styles.closeButton} onClick={closeModal}>Close</button>
                  <button type="button" className={styles.nextButton} onClick={nextStep}>Next</button>
                </div>
              </>
            )}
            {currentStep === 2 && (
              <>
                {formData.type === 'Interior' && (
                  <>
                    <SelectField
                      id="interiorType"
                      name="interiorType"
                      label="Interior Type"
                      value={formData.interiorType}
                      onChange={handleChange}
                      options={[
                        { value: '', label: 'Select Interior Type' },
                        { value: 'Modern', label: 'Modern' },
                        { value: 'Traditional', label: 'Traditional' },
                      ]}
                      error={errors.interiorType}
                    />
                    <SelectField
                      id="subType"
                      name="subType"
                      label="Sub Type"
                      value={formData.subType}
                      onChange={handleChange}
                      options={[
                        { value: '', label: 'Select Sub Type' },
                        { value: 'Kitchen', label: 'Kitchen' },
                        { value: 'Living Room', label: 'Living Room' },
                      ]}
                      error={errors.subType}
                    />
                  </>
                )}
                <TextField
                  id="plotSize"
                  name="plotSize"
                  label="Plot Size (Sq. Ft.)"
                  placeholder="Enter plot size"
                  value={formData.plotSize}
                  onChange={handleChange}
                  error={errors.plotSize}
                />
                <TextField
                  id="floors"
                  name="floors"
                  label="Floors requirements"
                  placeholder="Enter floors requirements"
                  value={formData.floors}
                  onChange={handleChange}
                  error={errors.floors}
                />
                <TextField
                  id="rooms"
                  name="rooms"
                  label="Rooms requirements"
                  placeholder="Enter rooms requirements"
                  value={formData.rooms}
                  onChange={handleChange}
                  error={errors.rooms}
                />
                <TextField
                  id="budget"
                  name="budget"
                  label="Budget"
                  placeholder="Enter budget"
                  value={formData.budget}
                  onChange={handleChange}
                  error={errors.budget}
                />
                <TextField
                  id="dayToStart"
                  name="dayToStart"
                  label="Day to start"
                  placeholder="Enter day to start"
                  value={formData.dayToStart}
                  onChange={handleChange}
                  error={errors.dayToStart}
                />
                <TextArea
                  id="extraInfo"
                  name="extraInfo"
                  label="Extra info"
                  placeholder="Add comments"
                  value={formData.extraInfo}
                  onChange={handleChange}
                  error={errors.extraInfo}
                />
                <div className={styles.formGroupBottom}>
                  <button type="button" className={styles.backButton} onClick={prevStep}>Back</button>
                  <button type="button" className={styles.nextButton} onClick={nextStep}>Next</button>
                </div>
              </>
            )}
            {currentStep === 3 && (
              <>
                <TextField
                  id="addressLine1"
                  name="addressLine1"
                  label="Address Line 1"
                  placeholder="Enter address line 1"
                  value={formData.addressLine1}
                  onChange={handleChange}
                  error={errors.addressLine1}
                />
                <TextField
                  id="addressLine2"
                  name="addressLine2"
                  label="Address Line 2"
                  placeholder="Enter address line 2"
                  value={formData.addressLine2}
                  onChange={handleChange}
                  error={errors.addressLine2}
                />
                <TextField
                  id="pincode"
                  name="pincode"
                  label="Pincode"
                  placeholder="Enter pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  error={errors.pincode}
                />
                <SelectField
                  id="country"
                  name="country"
                  label="Country"
                  value={formData.country}
                  onChange={handleChange}
                  options={[
                    { value: 'India', label: 'India' },
                  ]}
                  error={errors.country}
                />
                <SelectField
                  id="city"
                  name="city"
                  label="City"
                  value={formData.city}
                  onChange={handleChange}
                  options={[
                    { value: 'Gurgaon', label: 'Gurgaon' },
                  ]}
                  error={errors.city}
                />
                <SelectField
                  id="state"
                  name="state"
                  label="State"
                  value={formData.state}
                  onChange={handleChange}
                  options={[
                    { value: 'Haryana', label: 'Haryana' },
                  ]}
                  error={errors.state}
                />
                <SelectField
                  id="status"
                  name="status"
                  label="Status"
                  value={formData.status}
                  onChange={handleChange}
                  options={[
                    { value: 'Active', label: 'Active' },
                    { value: 'Inactive', label: 'Inactive' },
                    { value: 'Boq Sent', label: 'Boq Sent' },
                    { value: 'Deal Closed', label: 'Deal Closed' },
                    { value: 'Meeting Done', label: 'Meeting Done' },
                  ]}
                  error={errors.status}
                />
                <div className={styles.formGroupBottom}>
                  <button type="button" className={styles.backButton} onClick={prevStep}>Back</button>
                  <button type="submit" className={styles.saveButton}>Save</button>
                </div>
              </>
            )}
          </form>
        </div>
      </Modal>
    </div>
  );
}

const initialFormData = () => ({
  type: '',
  interiorType: '',
  subType: '',
  pincode: '',
  name: '',
  number: '',
  email: '',
  plotSize: '',
  floors: '',
  rooms: '',
  budget: '',
  dayToStart: '',
  extraInfo: '',
  addressLine1: '',
  addressLine2: '',
  country: 'India',
  city: 'Gurgaon',
  state: 'Haryana',
  priority: 'Medium',
  status: 'Active',
});

const TextField = ({ id, name, label, placeholder, value, onChange, error }) => (
  <>
    <label htmlFor={id}>{label}</label>
    <input
      type="text"
      id={id}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={error ? styles.errorInput : ''}
    />
    {error && <p className={styles.error}>{error}</p>}
  </>
);

const SelectField = ({ id, name, label, value, onChange, options, error }) => (
  <>
    <label htmlFor={id}>{label}</label>
    <select id={id} name={name} value={value} onChange={onChange} className={error ? styles.errorInput : ''}>
      {options.map((option, index) => (
        <option key={index} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    {error && <p className={styles.error}>{error}</p>}
  </>
);

const TextArea = ({ id, name, label, placeholder, value, onChange, error }) => (
  <>
    <label htmlFor={id}>{label}</label>
    <textarea
      id={id}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={error ? styles.errorInput : ''}
    />
    {error && <p className={styles.error}>{error}</p>}
  </>
);

export default LeadTable;
