import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTachometerAlt, faUser, faCog, faHandshake, faTruck, faSignOutAlt, faBook, faBuilding } from "@fortawesome/free-solid-svg-icons";
import { faFileInvoiceDollar, faAddressCard } from "@fortawesome/free-solid-svg-icons";

import styles from "./SideNavigation.module.css";

Modal.setAppElement('#root'); // Make sure to set the app element for accessibility

const SideNavigation = () => {
  const navigate = useNavigate();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);  // State to toggle settings submenu
  const role = localStorage.getItem('role'); // Retrieve the role from local storage

  const onDashboardClick = useCallback(() => {
    navigate("/");
  }, [navigate]);

  const onCustomerTextClick = useCallback(() => {
    navigate("/customers");
  }, [navigate]);

  const onAdminTextClick = useCallback(() => {
    navigate("/admin");
  }, [navigate]);

  const onPartnersTextClick = useCallback(() => {
    navigate("/partner");
  }, [navigate]);

  const onTransportTextClick = useCallback(() => {
    navigate("/transport");
  }, [navigate]);

  const onLeadTextClick = useCallback(() => {
    navigate("/Lead");
  }, [navigate]);

  const onBOQPageClick = useCallback(() => {
    navigate("/Boqstructure"); // Navigate to BOQ structure page
  }, [navigate]);
  
  const onSettingsClick = useCallback(() => {
    setIsSettingsOpen(!isSettingsOpen);  // Toggle the settings submenu
  }, [isSettingsOpen]);

  const onLogoutClick = useCallback(() => {
    setIsLogoutModalOpen(true);
  }, []);

  const confirmLogout = useCallback(() => {
    localStorage.removeItem('token'); // Remove token
    localStorage.removeItem('role');  // Remove role
    localStorage.removeItem('email'); // Remove email
    setIsLogoutModalOpen(false);
    navigate("/login"); // Redirect to login page
  }, [navigate]);

  const cancelLogout = useCallback(() => {
    setIsLogoutModalOpen(false);
  }, []);

  return (
    <div className={styles.sidebarParent}>
      <div className={styles.sidebar} />
      <div className={styles.item} onClick={onDashboardClick}>
        <FontAwesomeIcon icon={faTachometerAlt} className={styles.icon} />
        Dashboard
      </div>

      {/* Group Gomaterial Items */}
      <div className={styles.groupHeader}>Gomaterial</div>
      <div className={styles.item} onClick={onCustomerTextClick}>
        <FontAwesomeIcon icon={faUser} className={styles.icon} />
        Customer
      </div>
      <div className={styles.item} onClick={onPartnersTextClick}>
        <FontAwesomeIcon icon={faHandshake} className={styles.icon} />
        Partners
      </div>
      <div className={styles.item} onClick={onTransportTextClick}>
        <FontAwesomeIcon icon={faTruck} className={styles.icon} />
        Transports
      </div>

      {/* Group Housebanao Items */}
      <div className={styles.groupHeader}>Housebanao</div>
      <div className={styles.item} onClick={onLeadTextClick}>
        <FontAwesomeIcon icon={faAddressCard} className={styles.icon} />
        Lead
      </div>

      {/* Admin Section */}
      {role === 'admin' && (
        <div className={styles.item} onClick={onAdminTextClick}>
          <FontAwesomeIcon icon={faCog} className={styles.icon} />
          Admin
        </div>
      )}

      {/* Settings Section Below Admin */}
      <div className={styles.item} onClick={onSettingsClick}>
        <FontAwesomeIcon icon={faCog} className={styles.icon} />
        Settings
      </div>

      {isSettingsOpen && (
        <div className={styles.submenu}>
          <div className={styles.item} onClick={onLeadTextClick}>
            <FontAwesomeIcon icon={faAddressCard} className={styles.icon} />
            Housebanao
          </div>
          <div className={styles.item} onClick={onBOQPageClick}>
            <FontAwesomeIcon icon={faBuilding} className={styles.icon} />
            BOQ
          </div>
        </div>
      )}

      <div className={styles.logoutItem}>
        <button className={styles.logout} onClick={onLogoutClick}>
          <FontAwesomeIcon icon={faSignOutAlt} className={styles.icon} />
          Logout
        </button>
      </div>

      <Modal
        isOpen={isLogoutModalOpen}
        onRequestClose={cancelLogout}
        contentLabel="Logout Confirmation"
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        <h2>Confirm Logout</h2>
        <p>Are you sure you want to logout?</p>
        <div className={styles.modalButtons}>
          <button onClick={confirmLogout} className={styles.confirmButton}>Yes</button>
          <button onClick={cancelLogout} className={styles.cancelButton}>No</button>
        </div>
      </Modal>

      <div className={styles.copyright}>
        &copy; {new Date().getFullYear()} Vive Housebanao Technologies PVT LTD
      </div>
    </div>
  );
};

export default SideNavigation;
