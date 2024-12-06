import SideNavigation from "../components/SideNavigation/SideNavigation";
import Header from "../components/Header/Header";
import AdminTable from "../components/Admin/AdminTable";

import styles from "./Pages.module.css";

const Admin = () => {

  return (
    <div className={styles.container}>
      <Header />
      <SideNavigation />
      <AdminTable />
    </div>
  );
};

export default Admin;
