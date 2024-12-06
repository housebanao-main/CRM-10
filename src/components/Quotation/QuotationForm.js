import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import React, { useState, useEffect } from 'react';
import styles from './QuotationForm.module.css'; // Use CSS modules
import specificationsData from './specificationsData.json'; // Assuming JSON data here
import PDFPreview from './PDFPreview'; // Import the new PDFPreview component

const QuotationForm = () => {
    const [currentStep, setCurrentStep] = useState(1);

    // State for form data that needs to be persisted
    const [basicDetails, setBasicDetails] = useState({
        payeeName: '',
        selectedOption: '',
        crnNumber: '',
        plotArea: '',
        constructionPercentage: '',
        areaToBeConstructed: '',
        numberOfFloors: '',
        location: '',
        startDate: '',
        deliveryDate: '',
    });

    const [selectedItems, setSelectedItems] = useState(specificationsData); // For specifications
    const [paymentSchedule, setPaymentSchedule] = useState(''); // Payment Schedule state
    const [paymentDetails, setPaymentDetails] = useState({
        accountName: '',
        accountNumber: '',
        ifscCode: '',
        bankName: '',
        branch: '',
        upiId: ''
    });

    const handleStepClick = (step) => {
        setCurrentStep(step);
    };

    // Generate CRN Number on first load
    useEffect(() => {
        const generateCrnNumber = () => {
            const date = new Date();
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const sequence = Math.floor(Math.random() * 1000);
            return `CRN${year}${month}${day}${sequence}`;
        };
        setBasicDetails(prev => ({ ...prev, crnNumber: generateCrnNumber() }));
    }, []);

    return (
        <div className={styles.quotationFormContainer}>
            <div className={styles.progressTracker}>
                {['Basic Details', 'Specifications', 'Payment Schedule', 'Payment Mode', 'Create PDF'].map((label, index) => (
                    <div
                        key={index}
                        className={`${styles.progressStep} ${currentStep === index + 1 ? styles.activeStep : ''}`}
                        onClick={() => handleStepClick(index + 1)}
                    >
                        {label}
                    </div>
                ))}
            </div>

            <div className={styles.formContent}>
                {currentStep === 1 && (
                    <BasicDetails
                        basicDetails={basicDetails}
                        setBasicDetails={setBasicDetails}
                    />
                )}
                {currentStep === 2 && (
                    <Specifications
                        selectedItems={selectedItems}
                        setSelectedItems={setSelectedItems}
                    />
                )}
                {currentStep === 3 && (
                    <PaymentSchedule
                        paymentSchedule={paymentSchedule}
                        setPaymentSchedule={setPaymentSchedule}
                    />
                )}
                {currentStep === 4 && (
                 <PaymentMode
                  payeeName={basicDetails.payeeName}
                  paymentDetails={paymentDetails}
                  setPaymentDetails={setPaymentDetails}
                 />
                )}
                {currentStep === 5 && (
                    <PDFPreview
                        basicDetails={basicDetails}
                        selectedItems={selectedItems}
                        paymentSchedule={paymentSchedule}  // Ensure this prop is passed here
                        paymentDetails={paymentDetails}  // Ensure payment details are passed as well
                    />
                )}
              </div>

            <div className={styles.formNavigation}>
                {currentStep > 1 && <button onClick={() => setCurrentStep(currentStep - 1)}>Back</button>}
                {currentStep < 5 && <button onClick={() => setCurrentStep(currentStep + 1)}>Next</button>}
            </div>
        </div>
    );
};

const BasicDetails = ({ basicDetails, setBasicDetails }) => {
    const { payeeName, selectedOption, crnNumber, plotArea, constructionPercentage, areaToBeConstructed, numberOfFloors, location, startDate, deliveryDate } = basicDetails;

    useEffect(() => {
        const calculateAreaToBeConstructed = () => {
            if (plotArea && constructionPercentage) {
                const calculatedArea = (plotArea * constructionPercentage) / 100;
                setBasicDetails(prev => ({ ...prev, areaToBeConstructed: calculatedArea.toFixed(2) }));
            } else {
                setBasicDetails(prev => ({ ...prev, areaToBeConstructed: '' }));
            }
        };
        calculateAreaToBeConstructed();
    }, [plotArea, constructionPercentage, setBasicDetails]);

    return (
        <div className={styles.formSection}>
            <h2>Basic Details</h2>

            <div className={styles.createForSection}>
                <h3>Create For</h3>
                <div className={styles.optionsContainer}>
                    {['Construction', 'Home Interior', 'Construction + Interior', 'Office Interior'].map(option => (
                        <button
                            key={option}
                            className={`${styles.optionButton} ${selectedOption === option ? styles.activeOption : ''}`}
                            onClick={() => setBasicDetails(prev => ({ ...prev, selectedOption: option }))}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            </div>

            {selectedOption && (
                <>
                    <div className={styles.formRow}>
                        <div>
                            <label>CRN No.</label>
                            <input type="text" value={crnNumber} readOnly />
                        </div>
                        <div>
                            <label>Customer Name</label>
                            <input
                                type="text"
                                value={payeeName}
                                placeholder="Enter Name"
                                onChange={(e) => setBasicDetails(prev => ({ ...prev, payeeName: e.target.value }))}
                            />
                        </div>
                        <div>
                            <label>Package Name</label>
                            <select>
                                <option value="999">999 INR</option>
                                <option value="1499">1499 INR</option>
                                <option value="1799">1799 INR</option>
                                <option value="2399">2399 INR</option>
                            </select>
                        </div>
                    </div>

                    <div className={styles.formRow}>
                        <div>
                            <label>Plot Area</label>
                            <input
                                type="number"
                                placeholder="Sq. Ft."
                                value={plotArea}
                                onChange={(e) => setBasicDetails(prev => ({ ...prev, plotArea: e.target.value }))}
                            />
                        </div>
                        <div>
                            <label>Construction Area (%age)</label>
                            <input
                                type="number"
                                placeholder="Enter Percentage"
                                value={constructionPercentage}
                                onChange={(e) => setBasicDetails(prev => ({ ...prev, constructionPercentage: e.target.value }))}
                            />
                        </div>
                        <div>
                            <label>Area to be constructed</label>
                            <input type="number" value={areaToBeConstructed} readOnly />
                        </div>
                    </div>

                    <div className={styles.formRow}>
                        <div>
                            <label>No. of Floors</label>
                            <select value={numberOfFloors} onChange={(e) => setBasicDetails(prev => ({ ...prev, numberOfFloors: e.target.value }))}>
                                <option value="G">G (Ground Floor)</option>
                                <option value="G+1">G+1</option>
                                <option value="G+2">G+2</option>
                                <option value="G+3">G+3</option>
                                {/* Add more floor options as needed */}
                            </select>
                        </div>
                        <div>
                            <label>Location</label>
                            <input
                                type="text"
                                placeholder="Choose Pincode"
                                value={location}
                                onChange={(e) => setBasicDetails(prev => ({ ...prev, location: e.target.value }))}
                            />
                        </div>
                        <div>
                            <label>Start Date</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setBasicDetails(prev => ({ ...prev, startDate: e.target.value }))}
                            />
                        </div>
                    </div>

                    <div className={styles.formRow}>
                        <div>
                            <label>Delivery Date</label>
                            <input
                                type="date"
                                value={deliveryDate}
                                onChange={(e) => setBasicDetails(prev => ({ ...prev, deliveryDate: e.target.value }))}
                            />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

const Specifications = ({ selectedItems, setSelectedItems }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleInputChange = (e, index, field) => {
        // Find the actual item index in the selectedItems array
        const itemIndex = selectedItems.findIndex(item => item.name === filteredItems[index].name);
        const updatedItems = [...selectedItems];
        updatedItems[itemIndex][field] = e.target.value;

        if (field === 'areaQty' || field === 'cost') {
            const areaQty = parseFloat(updatedItems[itemIndex].areaQty) || 0;
            const cost = parseFloat(updatedItems[itemIndex].cost) || 0;
            updatedItems[itemIndex].totalCosting = (areaQty * cost).toFixed(2);
        }

        setSelectedItems(updatedItems);
    };

    const handleCheckboxChange = (e, index) => {
        // Find the actual item index in the selectedItems array
        const itemIndex = selectedItems.findIndex(item => item.name === filteredItems[index].name);
        const updatedItems = [...selectedItems];
        updatedItems[itemIndex].checked = e.target.checked;
        setSelectedItems(updatedItems);
    };

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
    };

    const filteredItems = searchTerm
        ? selectedItems.filter(item => item.name.toLowerCase().includes(searchTerm))
        : selectedItems;

    return (
        <div>
            <h2>Specifications</h2>
            <input
                type="text"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={handleSearch}
                className={styles.searchBar}
            />

            {filteredItems.map((item, index) => (
                <div key={index} className={styles.specificationItem}>
                    <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={(e) => handleCheckboxChange(e, index)}
                    />
                    <label>{item.name}</label>

                    <div className={styles.formRow}>
                        <select
                            value={item.particulars}
                            onChange={(e) => handleInputChange(e, index, 'particulars')}
                            disabled={!item.checked}
                        >
                            <option value="">Select Particulars</option>
                            {item.particularsOptions.map((particular, idx) => (
                                <option key={idx} value={particular}>
                                    {particular}
                                </option>
                            ))}
                        </select>

                        <select
                            value={item.coreMaterial}
                            onChange={(e) => handleInputChange(e, index, 'coreMaterial')}
                            disabled={!item.checked}
                        >
                            <option value="">Select Core Material</option>
                            {item.coreMaterialOptions.map((coreMat, idx) => (
                                <option key={idx} value={coreMat}>
                                    {coreMat}
                                </option>
                            ))}
                        </select>

                        <select
                            value={item.finishMaterial}
                            onChange={(e) => handleInputChange(e, index, 'finishMaterial')}
                            disabled={!item.checked}
                        >
                            <option value="">Select Finish Material</option>
                            {item.finishMaterialOptions.map((finishMat, idx) => (
                                <option key={idx} value={finishMat}>
                                    {finishMat}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.formRow}>
                        <select
                            value={item.measureType}
                            onChange={(e) => handleInputChange(e, index, 'measureType')}
                            disabled={!item.checked}
                        >
                            <option value="Area">Area</option>
                            <option value="Quantity">Quantity</option>
                        </select>

                        <input
                            type="number"
                            placeholder={item.measureType === "Area" ? "Area (Sq. Ft.)" : "Quantity"}
                            value={item.areaQty}
                            onChange={(e) => handleInputChange(e, index, 'areaQty')}
                            disabled={!item.checked}
                        />

                        <input
                            type="number"
                            placeholder="Cost"
                            value={item.cost}
                            onChange={(e) => handleInputChange(e, index, 'cost')}
                            disabled={!item.checked}
                        />
                    </div>

                    <div className={styles.formRow}>
                        <input
                            type="number"
                            placeholder="Total Costing"
                            value={item.totalCosting}
                            readOnly
                            style={{ width: '360px' }}
                        />
                    </div>
                    <hr />
                </div>
            ))}
        </div>
    );
};


const PaymentSchedule = ({ paymentSchedule, setPaymentSchedule }) => {
    return (
        <div>
            <h2>Payment Schedule</h2>
            <textarea
                value={paymentSchedule}
                onChange={(e) => setPaymentSchedule(e.target.value)}
                placeholder="Enter payment schedule details here..."
                className={styles.paymentTextarea}
            />
        </div>
    );
};

const PaymentMode = ({ payeeName }) => {
    const paymentDetails = {
        accountNumber: '1234567890123456',
        ifscCode: 'ABC1234567',
        branch: 'Main Branch, City Name',
        accountName: 'Savings Account',
        bankName: 'XYZ Bank',
        upiId: 'payee@upi'
    };

    return (
        <div>
            <h2>Payment Mode</h2>
            <p>You can also make an Online transaction to the below account details:</p>
            <table className={styles.paymentTable}>
                <tbody>
                    <tr>
                        <th>Name</th>
                        <td>{payeeName}</td>
                    </tr>
                    <tr>
                        <th>Virtual A/C Number</th>
                        <td>{paymentDetails.accountNumber}</td>
                    </tr>
                    <tr>
                        <th>Bank IFSC</th>
                        <td>{paymentDetails.ifscCode}</td>
                    </tr>
                    <tr>
                        <th>Branch</th>
                        <td>{paymentDetails.branch}</td>
                    </tr>
                    <tr>
                        <th>A/C Type</th>
                        <td>{paymentDetails.accountName}</td>
                    </tr>
                    <tr>
                        <th>Bank</th>
                        <td>{paymentDetails.bankName}</td>
                    </tr>
                    <tr>
                        <th>UPI ID</th>
                        <td>{paymentDetails.upiId}</td>
                    </tr>
                </tbody>
            </table>

            <p className={styles.paymentInstructions}>
                Please issue A/c Payee cheques in the name of "{payeeName}"
            </p>
            <p className={styles.qrInstructions}>
                <strong>Scan the QR code to pay through UPI</strong>
            </p>
        </div>
    );
};


const CreatePDF = ({ basicDetails = {}, selectedItems = [] }) => {
    const [isFormValid, setIsFormValid] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [previewUrl, setPreviewUrl] = useState('');

    // Validate only the basic details and specifications
    const validateBasicDetails = () => {
        // Ensure basicDetails is not undefined and all values are filled
        const areBasicDetailsFilled = basicDetails && Object.values(basicDetails).every(value => value !== '');

        // Ensure selectedItems is not undefined, and for each checked item, all required fields are filled
        const areSelectedItemsFilled = selectedItems && selectedItems.every(
            item => !item.checked || (item.particulars && item.coreMaterial && item.finishMaterial && item.areaQty && item.cost)
        );

        // Set form validity based on both checks
        setIsFormValid(areBasicDetailsFilled && areSelectedItemsFilled);
    };

    // Revalidate the form when basicDetails or selectedItems change
    useEffect(() => {
        validateBasicDetails();
    }, [basicDetails, selectedItems]);

    const generatePDFContent = () => {
        const doc = new jsPDF();

        // Create a formatted BOQ string from basic details
        const basicDetailsString = `
            CRN No: ${basicDetails.crnNumber || ''}
            Customer Name: ${basicDetails.payeeName || ''}
            Package: ${basicDetails.selectedOption || ''}
            Plot Area: ${basicDetails.plotArea || ''} sq.ft
            Construction Percentage: ${basicDetails.constructionPercentage || ''}%
            Area to be Constructed: ${basicDetails.areaToBeConstructed || ''} sq.ft
            Number of Floors: ${basicDetails.numberOfFloors || ''}
            Location: ${basicDetails.location || ''}
            Start Date: ${basicDetails.startDate || ''}
            Delivery Date: ${basicDetails.deliveryDate || ''}
        `;

        // Create a formatted BOQ table from selected items
        let specificationsString = 'Specifications:\n\n';
        selectedItems.forEach(item => {
            if (item.checked) {
                specificationsString += `
                    Name: ${item.name}
                    Particulars: ${item.particulars}
                    Core Material: ${item.coreMaterial}
                    Finish Material: ${item.finishMaterial}
                    Measure Type: ${item.measureType}
                    Area/Quantity: ${item.areaQty}
                    Cost: ${item.cost}
                    Total Costing: ${item.totalCosting}\n\n
                `;
            }
        });

        // Combine both basic details and specifications into a single string
        const boqContent = `${basicDetailsString}\n\n${specificationsString}`;

        // Add the content to the PDF
        doc.text(boqContent, 10, 10);

        // Convert the PDF content to a Blob and create an object URL for preview
        const pdfBlob = doc.output('blob');
        const pdfUrl = URL.createObjectURL(pdfBlob);
        setPreviewUrl(pdfUrl);
    };

    const handleShowPreview = () => {
        if (isFormValid) {
            generatePDFContent();
            setShowPreview(true);
        }
    };

    const handleDownloadPDF = () => {
        const link = document.createElement('a');
        link.href = previewUrl;
        link.download = 'BOQ.pdf';
        link.click();
    };

    return (
        <div>
            <h2>Create PDF Content</h2>
            <button onClick={handleShowPreview} disabled={!isFormValid}>
                Show Preview
            </button>
            {!isFormValid && (
                <p style={{ color: 'red' }}>
                    Please complete all required fields in Basic Details and Specifications before generating the PDF.
                </p>
            )}

            {/* Show PDF Preview */}
            {showPreview && (
                <div>
                    <h3>PDF Preview</h3>
                    <iframe
                        src={previewUrl}
                        title="PDF Preview"
                        width="100%"
                        height="500px"
                    ></iframe>
                    <button onClick={handleDownloadPDF}>
                        Download PDF
                    </button>
                </div>
            )}
        </div>
    );
};

export default QuotationForm;
