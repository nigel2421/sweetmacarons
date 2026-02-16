
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Generates a PDF receipt for a given order.
 * @param {Object} order The order data from Firestore.
 */
export const generateOrderReceipt = async (order) => {
    if (!order) return;

    const doc = new jsPDF();
    const logoUrl = '/images/logo.png';

    // Helper to load image
    const loadImage = (url) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = url;
        });
    };

    try {
        const logo = await loadImage(logoUrl);
        doc.addImage(logo, 'PNG', 10, 10, 30, 30);
    } catch (error) {
        console.error("Failed to load logo for PDF:", error);
    }

    // Header
    doc.setFontSize(22);
    doc.setTextColor(231, 84, 128); // #e75480
    doc.text('Los Tres Macarons', 45, 25);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('Premium Handcrafted Macarons', 45, 32);
    doc.text('Contact: lostresmacarons@gmail.com | +254 723 734211', 45, 37);

    // Divider
    doc.setDrawColor(200);
    doc.line(10, 45, 200, 45);

    // Order Info
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.setFont('helvetica', 'bold');
    doc.text(`RECEIPT: ${order.orderId}`, 10, 55);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Date: ${new Date(order.createdAt?.toDate?.() || order.createdAt).toLocaleString()}`, 10, 62);

    // Dynamic Customer ID
    const customerId = order.userEmail || order.userName || order.userId || 'Anonymous';
    doc.text(`Customer ID: ${customerId}`, 10, 67);

    doc.text(`Order Status: ${order.status?.toUpperCase() || 'PENDING'}`, 10, 72);
    doc.text(`Delivery Option: ${order.deliveryOption || 'N/A'}`, 10, 77);

    if (order.deliveryAddress) {
        doc.text('Delivery Address:', 10, 82);
        const splitAddress = doc.splitTextToSize(order.deliveryAddress, 80);
        doc.text(splitAddress, 10, 87);
    }

    // Items Table
    const tableData = order.items.map((item, index) => [
        index + 1,
        `${item.macaron.name} (Box of ${item.option.box})`,
        item.quantity,
        `Ksh ${item.option.price.toLocaleString()}`,
        `Ksh ${(item.option.price * item.quantity).toLocaleString()}`
    ]);

    autoTable(doc, {
        startY: 100,
        head: [['#', 'Description', 'Qty', 'Unit Price', 'Total']],
        body: tableData,
        headStyles: { fillColor: [231, 84, 128] },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        margin: { top: 100 }
    });

    const finalY = doc.lastAutoTable.finalY + 10;

    // Financial Summary
    doc.setFontSize(11);
    const labelX = 120;
    const valueX = 190;

    doc.text(`Subtotal:`, labelX, finalY);
    doc.text(`Ksh ${order.macaronsTotal?.toLocaleString() || '0'}`, valueX, finalY, { align: 'right' });

    doc.text(`Delivery Fee:`, labelX, finalY + 7);
    doc.text(`Ksh ${order.deliveryFee?.toLocaleString() || '0'}`, valueX, finalY + 7, { align: 'right' });

    doc.line(labelX, finalY + 10, valueX, finalY + 10);

    doc.setFont('helvetica', 'bold');
    doc.text(`Grand Total:`, labelX, finalY + 17);
    doc.text(`Ksh ${((order.macaronsTotal || 0) + (order.deliveryFee || 0)).toLocaleString()}`, valueX, finalY + 17, { align: 'right' });

    doc.setTextColor(200, 0, 0);
    doc.text(`Deposit Paid:`, labelX, finalY + 24);
    doc.text(`Ksh ${order.depositAmount?.toLocaleString() || '0'}`, valueX, finalY + 24, { align: 'right' });

    doc.setTextColor(0);
    doc.text(`Balance Due:`, labelX, finalY + 31);
    doc.text(`Ksh ${order.balance?.toLocaleString() || '0'}`, valueX, finalY + 31, { align: 'right' });

    // Footer
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text('Thank you for choosing Los Tres Macarons!', doc.internal.pageSize.width / 2, pageHeight - 20, { align: 'center' });
    doc.text('Visit us again soon!', doc.internal.pageSize.width / 2, pageHeight - 15, { align: 'center' });

    // Save the PDF
    doc.save(`Receipt_${order.orderId}.pdf`);
};
