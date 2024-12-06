import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header/Header';
import BoqTable from '../components/Boq/BoqTable';
import styles from './Pages.module.css';

const Boq = () => {
  const location = useLocation();  // Get the location object which contains the state
  const { packages } = location.state || {};  // Destructure the packages passed from previous page

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.mainContent}>
        {/* Passing the packages to BoqTable */}
        <BoqTable packages={packages} />
      </div>
    </div>
  );
};

export default Boq;
