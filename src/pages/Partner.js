import SideNavigation from "../components/SideNavigation/SideNavigation";
import Header from "../components/Header/Header";
import PartnerTable from "../components/Partner/PartnerTable";

import styles from "./Pages.module.css";

const Customers = () => {

  return (
    <div className={styles.container}>
      <Header />
      <SideNavigation />
      <PartnerTable />
    </div>
  );
};

export default Customers;
