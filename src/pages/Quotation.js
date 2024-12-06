import SideNavigation from "../components/SideNavigation/SideNavigation";
import Header from "../components/Header/Header";
import QuotationForm from "../components/Quotation/QuotationForm";

import styles from "./Pages.module.css";

const Quotation = () => {

  return (
    <div className={styles.container}>
      <Header />
      <SideNavigation />
      <QuotationForm />
    </div>
  );
};

export default Quotation;
