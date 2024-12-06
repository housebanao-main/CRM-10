import { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Import autoTable plugin

const PDFPreview = ({ basicDetails = {}, selectedItems = [], paymentSchedule = 'Not Provided', paymentDetails = {} }) => {
    const [isFormValid, setIsFormValid] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [previewUrl, setPreviewUrl] = useState('');

    // Ensure paymentDetails have defaults
    const defaultPaymentDetails = {
        accountName: 'Not Provided',
        accountNumber: 'Not Provided',
        ifscCode: 'Not Provided',
        bankName: 'Not Provided',
        branch: 'Not Provided',
        upiId: 'Not Provided',
        ...paymentDetails, // Override default values with provided paymentDetails
    };

    const validateBasicDetails = () => {
        const areBasicDetailsFilled = basicDetails && Object.values(basicDetails).every(value => value !== '');
        const areSelectedItemsFilled = selectedItems && selectedItems.every(
            item => !item.checked || (item.particulars && item.coreMaterial && item.finishMaterial && item.areaQty && item.cost)
        );
        setIsFormValid(areBasicDetailsFilled && areSelectedItemsFilled);
    };

    useEffect(() => {
        validateBasicDetails();
    }, [basicDetails, selectedItems]);

    const checkPageOverflow = (doc, yOffset) => {
        const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
        if (yOffset >= pageHeight - 20) { // Leave some margin at the bottom
            doc.addPage();
            yOffset = 20; // Reset yOffset after adding a new page
        }
        return yOffset;
    };

    const generatePDFContent = () => {
        const doc = new jsPDF();

        // Add light background color for the title section
        doc.setFillColor(230, 230, 230); // Light grey color
        doc.rect(10, 5, doc.internal.pageSize.getWidth() - 20, 25, 'F'); // Adjusted to fit the header properly

        // Add CRN No and Customer Name on the left side
        doc.setFontSize(10);
        doc.setFont('Helvetica', 'normal');
        doc.text(`Ref No: ${basicDetails.crnNumber || ''}`, 15, 15);  // Position at the top left
        doc.text(`Name: ${basicDetails.payeeName || ''}`, 15, 20);  // Below CRN No

        // Company info on the right side
        doc.setFontSize(10);
        doc.text('Company No: 6202105424', doc.internal.pageSize.getWidth() - 65, 15);  // Adjusted position to fit the box
        doc.text('Phone: +91 6202105424', doc.internal.pageSize.getWidth() - 65, 20);  // Adjusted position to fit the box
        doc.text('Email: support@housebanao.com', doc.internal.pageSize.getWidth() - 65, 25);  // Adjusted position to fit the box

        doc.setLineWidth(1);  // Set the line width
        doc.line(10, 30, doc.internal.pageSize.getWidth() - 10, 30);  // Draw the line from left to right (startX, startY, endX, endY)

        // Centered Title with color #a46254
        doc.setFontSize(18);
        doc.setFont('Helvetica', 'bold');
        doc.setTextColor('#a46254'); // Set title color
        doc.text('Greeting From House Banao', doc.internal.pageSize.getWidth() / 2.1, 40, { align: 'right' });

        // Reset text color to black for the rest of the content
        doc.setTextColor(0, 0, 0); // Reset to black

        // Main content - all fonts are set to size 12
        doc.setFontSize(11);
        doc.setFont('Helvetica', 'normal');
        let yOffset = 50;

        const lineSpacing = 6;  // Set a tighter line spacing value

        const longText1 = `At HouseBanao, our talented team of creative professionals is dedicated to making every design both stunning and functional.`;
        const splitText1 = doc.splitTextToSize(longText1, 180);
        doc.text(splitText1, 15, yOffset);
        yOffset += splitText1.length * lineSpacing;

        const longText2 = `We stand out as pioneers with our vertically integrated in-house production unit, equipped with top-tier automation technology and innovative solutions. Our collaborations with renowned brands like Hettich and Airolam/StyLam ensure that we offer premium, high-quality products.`;
        const splitText2 = doc.splitTextToSize(longText2, 180);
        doc.text(splitText2, 15, yOffset);
        yOffset += splitText2.length * lineSpacing;

        const longText3 = `Having designed and delivered over 2000 beautifully crafted homes—including apartments, bungalows, duplexes, villas, and villaments—we are recognized as one of the fastest-growing design firms in Delhi.`;
        const splitText3 = doc.splitTextToSize(longText3, 180);
        doc.text(splitText3, 15, yOffset);
        yOffset += splitText3.length * lineSpacing;

        doc.text(`These accomplishments are a testament to our exceptional team of dedicated professionals.`, 15, yOffset);
        yOffset += lineSpacing;

        const longText4 = `Our in-house designers give personalized attention to each client’s needs, ensuring that every home is a remarkable #housebanao creation.`;
        const splitText4 = doc.splitTextToSize(longText4, 180);
        doc.text(splitText4, 15, yOffset);
        yOffset += splitText4.length * lineSpacing;

        doc.text(`We deeply value our customers and are honored that you chose HouseBanao for your interior design needs.`, 15, yOffset);
        yOffset += lineSpacing + 5;  // Slightly more space before the next section

        yOffset = checkPageOverflow(doc, yOffset);  // Check page overflow

        // Subtitle "House Banao Advantages" with color #a46254
        doc.setFontSize(16);
        doc.setFont('Helvetica', 'bold');
        doc.setTextColor('#a46254'); // Set subtitle color
        doc.text('House Banao Advantages', 15, yOffset); // Align to the left at X = 15
        yOffset += 10;

        // Reset text color to black for the rest of the content
        doc.setTextColor(0, 0, 0); // Reset to black

        const points = {
            start: '• Regular Quality Checks',
            center: '• Zero Hidden Costs',
            end: '• 10 Years Warranty'
        };

        const pageWidth = doc.internal.pageSize.getWidth();
        const startX = 15;
        const centerX = pageWidth / 2 - (doc.getTextWidth(points.center) / 2); // Centered
        const endX = pageWidth - doc.getTextWidth(points.end) - 15; // End aligned with some padding

        doc.setFontSize(11); // All other font size is 12
        doc.setFont('Helvetica', 'normal');

        doc.text(points.start, startX, yOffset);
        doc.text(points.center, centerX, yOffset);
        doc.text(points.end, endX, yOffset);

        yOffset += 15;

        yOffset = checkPageOverflow(doc, yOffset);  // Check page overflow

        // Subtitle "Project Details" with color #a46254
        doc.setFontSize(14);
        doc.setFont('Helvetica', 'bold');
        doc.setTextColor('#a46254'); // Set subtitle color
        doc.text('Project Details:', 15, yOffset);
        yOffset += 10;

        // Reset text color to black for the rest of the content
        doc.setTextColor(0, 0, 0); // Reset to black

        doc.setFontSize(11);
        doc.setFont('Helvetica', 'normal');

        const projectDetails = [
            { label: 'Package', value: basicDetails.selectedOption || '' },
            { label: 'Plot Area', value: `${basicDetails.plotArea || ''} sq.ft` },
            { label: 'Construction Percentage', value: `${basicDetails.constructionPercentage || ''}%` },
            { label: 'Area to be Constructed', value: `${basicDetails.areaToBeConstructed || ''} sq.ft` },
            { label: 'Number of Floors', value: basicDetails.numberOfFloors || '' },
            { label: 'Location', value: basicDetails.location || '' },
            { label: 'Start Date', value: basicDetails.startDate || '' },
            { label: 'Delivery Date', value: basicDetails.deliveryDate || '' },
        ];

        const labelX = 15;
        const valueX = 80;
        const lineHeight = 7;

        projectDetails.forEach(detail => {
            doc.setFont('Helvetica', 'bold');
            doc.text(`${detail.label}:`, labelX, yOffset);
            doc.setFont('Helvetica', 'normal');
            doc.text(detail.value, valueX, yOffset);
            yOffset += lineHeight;
            yOffset = checkPageOverflow(doc, yOffset);  // Check page overflow after each line
        });

        yOffset += 10;

        // Specifications Table (Only show checked items)
        const tableRows = selectedItems
            .filter(item => item.checked)
            .map(item => [
                item.name,
                item.particulars,
                item.coreMaterial,
                item.finishMaterial,
                item.measureType,
                item.areaQty,
                item.cost,
                item.totalCosting
            ])
            .filter(row => row.every(cell => cell !== undefined));

        if (tableRows.length > 0) {
            doc.autoTable({
                body: tableRows,
                startY: yOffset,
                margin: { top: 20 },
                theme: 'plain',
                styles: {
                    fontSize: 10, // Ensure table font size is 12
                    cellPadding: 6,
                    halign: 'center',
                    valign: 'middle',
                },
                alternateRowStyles: { fillColor: [240, 240, 240] },
            });
            yOffset = doc.lastAutoTable.finalY + 20;
            yOffset = checkPageOverflow(doc, yOffset);
        } else {
            doc.text("No Specifications Selected.", 15, yOffset);
        }

        yOffset += 20;
        yOffset = checkPageOverflow(doc, yOffset);

        // Subtitle "Payment Schedule" with color #a46254
        doc.setFontSize(14);
        doc.setFont('Helvetica', 'bold');
        doc.setTextColor('#a46254'); // Set subtitle color
        doc.text('Payment Schedule:', 15, yOffset);
        yOffset += 10;

        // Reset text color to black for the rest of the content
        doc.setTextColor(0, 0, 0); // Reset to black

        doc.setFontSize(11);
        doc.setFont('Helvetica', 'normal');
        const splitPaymentSchedule = doc.splitTextToSize(paymentSchedule || 'Not Provided', 180);
        doc.text(splitPaymentSchedule, 15, yOffset);
        yOffset += splitPaymentSchedule.length * 5 + 10;
        yOffset = checkPageOverflow(doc, yOffset);

        yOffset += 10;

        // Subtitle "Payment Details" with color #a46254
        doc.setFontSize(14);
        doc.setFont('Helvetica', 'bold');
        doc.setTextColor('#a46254'); // Set subtitle color
        doc.text('Payment Details:', 15, yOffset);
        yOffset += 10;

        // Reset text color to black for the rest of the content
        doc.setTextColor(0, 0, 0); // Reset to black

        const paymentDetailsTable = [
            ['Account Name', defaultPaymentDetails.accountName],
            ['Account Number', defaultPaymentDetails.accountNumber],
            ['IFSC Code', defaultPaymentDetails.ifscCode],
            ['Bank Name', defaultPaymentDetails.bankName],
            ['Branch', defaultPaymentDetails.branch],
            ['UPI ID', defaultPaymentDetails.upiId],
        ];

        doc.autoTable({
            startY: yOffset,
            head: [['Field', 'Details']],
            body: paymentDetailsTable,
            theme: 'plain',
            styles: {
                fontSize: 11, // Ensure table font size is 12
                cellPadding: 6,
                halign: 'left',
                valign: 'middle',
            },
            headStyles: {
                fillColor: [240, 240, 240],
            },
            bodyStyles: {
                fillColor: [255, 255, 255],
                textColor: [0, 0, 0],
            },
            alternateRowStyles: {
                fillColor: [245, 245, 245],
            },
            columnStyles: {
                0: { cellWidth: 60, fillColor: [240, 240, 240] },
                1: { cellWidth: 120, fillColor: [240, 240, 240] },
            },
            margin: { left: 15, right: 15 },
        });

        yOffset = doc.lastAutoTable.finalY + 20;
        yOffset = checkPageOverflow(doc, yOffset);

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

export default PDFPreview;
