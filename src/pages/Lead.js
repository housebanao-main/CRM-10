import SideNavigation from "../components/SideNavigation/SideNavigation";
import Header from "../components/Header/Header";
import LeadTable from "../components/Lead/LeadTable";

import styles from "./Pages.module.css";

const Lead = () => {

  return (
    <div className={styles.container}>
      <Header />
      <SideNavigation />
      <LeadTable />
    </div>
  );
};

export default Lead;
