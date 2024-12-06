import React from 'react';
import { useLocation } from 'react-router-dom';
import Costbreakup from '../components/BoqStructure/Costbreakup/Costbreakup';  // Correct import for Costbreakup


const Boq = () => {
 
  return (
    <div className={styles.container}>
      
        <Costbreakup />
      </div>
   
  );
};

export default Boq;
