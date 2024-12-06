import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from "./LeadHeader.module.css";

const LeadHeader = ({ activeTab, lead }) => {
  const navigate = useNavigate();

  const handleTabClick = (tab) => {
    switch (tab) {
      case 'details':
        navigate('/creation', { state: { lead } });
        break;
      case 'boq':
        navigate('/boq', { state: { lead } });
        break;
      case 'team':
        navigate('/team', { state: { lead } });
        break;
      case 'siteInspection':
        navigate('/site-inspection', { state: { lead } });
        break;
      default:
        break;
    }
  };

  return (
    <div>
      <header className="header">
        <div className="header-left">
          <button className="back-button" onClick={() => navigate(-1)}>←</button>
          <h5>Lead / {lead?.leadId && <span>{lead.leadId}</span>}</h5>
        </div>
      </header>

      <nav className="tabs">
        <div 
          className={`tab ${activeTab === 'details' ? 'active' : ''}`} 
          onClick={() => handleTabClick('details')}
        >
          Details
        </div>
        <div 
          className={`tab ${activeTab === 'boq' ? 'active' : ''}`} 
          onClick={() => handleTabClick('boq')}
        >
          BOQ
        </div>
        <div 
          className={`tab ${activeTab === 'team' ? 'active' : ''}`} 
          onClick={() => handleTabClick('team')}
        >
          Team
        </div>
        <div 
          className={`tab ${activeTab === 'siteInspection' ? 'active' : ''}`} 
          onClick={() => handleTabClick('siteInspection')}
        >
          Site Inspection
        </div>
      </nav>
    </div>
  );
};

export default LeadHeader;
