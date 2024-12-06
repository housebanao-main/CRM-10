import { useState } from "react";
import SideNavigation from "../components/SideNavigation/SideNavigation";
import BoqOne from "../components/BoqStructure/BoqOne/BoqOne";
import BoqTwo from "../components/BoqStructure/BoqTwo/BoqTwo";
import BoqThree from "../components/BoqStructure/BoqThree/BoqThree";
import styles from './Boqstructure.module.css';

const BoqStructure = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [boqData, setBoqData] = useState({ packages: [], items: [] });
  const [selectedImage, setSelectedImage] = useState(null);

  const goToStep = (step) => {
    setCurrentStep(step);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    goToStep(2);
  };

  const handleBoqSave = (data) => {
    setBoqData(data);
    goToStep(3);
  };

  const handleImageSelect = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const handleEdit = (index) => {
    goToStep(2);
  };

  return (
    <div className={styles.container}>
      <SideNavigation />
      <div className={styles.content}>
        {currentStep === 1 && <BoqOne onSelectCategory={handleCategorySelect} />}
        {currentStep === 2 && (
          <BoqTwo
            onBack={() => goToStep(1)}
            onSave={handleBoqSave}
            defaultCategory={selectedCategory}
            onImageSelect={handleImageSelect}
          />
        )}
        {currentStep === 3 && (
          <BoqThree
            packages={boqData.packages}
            selectedImage={selectedImage}
            onBack={() => goToStep(2)}
            onEdit={handleEdit}
          />
        )}
      </div>
    </div>
  );
};

export default BoqStructure;
