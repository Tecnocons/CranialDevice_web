import jsPDF from 'jspdf';

const generatePDF = (patient, measurements, pathologies, symptoms, traumaticEvents, surgeries, treatments) => {
  const doc = new jsPDF('landscape');

  // Function to add a section with styling
  const addSection = (title, items, doc) => {
    doc.addPage();
    doc.setFontSize(40);
    doc.setTextColor(0, 0, 128);
    doc.text(title, doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });

    let y = 30;
    const columnWidth = (doc.internal.pageSize.getWidth() - 20) / 2;
    const column1X = 10;
    const column2X = column1X + columnWidth + 10;

    doc.setFontSize(20);
    doc.setTextColor(0, 0, 0);

    doc.setLineWidth(0.5);
    doc.line(column1X + columnWidth, 25, column1X + columnWidth, doc.internal.pageSize.getHeight() - 10);

    for (let i = 0; i < items.length; i++) {
      const x = i % 2 === 0 ? column1X : column2X;
      if (i % 2 === 0 && i !== 0) y += 10;
      doc.text(`• ${items[i].name}`, x, y);
    }
  };

  // Cover page
  doc.setFontSize(20);
  doc.setTextColor(0, 0, 128);
  doc.text(`Cartella Clinica di ${patient.nominativo}`, doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });

  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.setFillColor(230, 230, 230);
  doc.rect(10, 30, doc.internal.pageSize.getWidth() - 20, 40, 'FD');
  doc.text('Informazioni del Paziente', 15, 40);
  doc.setFontSize(12);
  doc.text(`Nome: ${patient.nominativo}`, 15, 50);
  doc.text(`Età: ${patient.eta}`, 15, 55);
  doc.text(`Altezza: ${patient.altezza}`, 15, 60);
  doc.text(`Peso: ${patient.peso}`, 15, 65);
  doc.text(`Sesso: ${patient.sesso}`, 15, 70);

  // Adding sections
  addSection('Misurazioni', measurements.map(m => ({ name: `${m.date}: ${m.value}` })), doc);
  addSection('Patologie', pathologies, doc);
  addSection('Sintomi', symptoms, doc);
  addSection('Eventi Traumatici', traumaticEvents, doc);
  addSection('Interventi', surgeries, doc);
  addSection('Trattamenti', treatments, doc);

  doc.save(`Cartella_Clinica_${patient.nominativo}.pdf`);
};

export default generatePDF;
