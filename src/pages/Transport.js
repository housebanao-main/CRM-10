import SideNavigation from "../components/SideNavigation/SideNavigation";
import Header from "../components/Header/Header";
import TransportTable from "../components/Transport/TransportTable";

import styles from "./Pages.module.css";

const Transports = () => {

  return (
    <div className={styles.container}>
      <Header />
      <SideNavigation />
      <TransportTable />
    </div>
  );
};

export default Transports;
