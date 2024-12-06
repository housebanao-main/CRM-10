import SideNavigation from "../components/SideNavigation/SideNavigation";
import Header from "../components/Header/Header";
import CustomerTable from "../components/Customer/CustomerTable";

import styles from "./Pages.module.css";

const Customers = () => {

  return (
    <div className={styles.container}>
      <Header />
      <SideNavigation />
      <CustomerTable />
    </div>
  );
};

export default Customers;
