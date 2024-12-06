import SideNavigation from "../components/SideNavigation/SideNavigation";
import Header from "../components/Header/Header";
import LeadDetails from "../components/LeadDetails/LeadDetails";

import styles from "./Pages.module.css";

const Creation = () => {

  return (
    <div className={styles.container}>
      <Header />
      <SideNavigation />
      <LeadDetails />
    </div>
  );
};

export default Creation;
