import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format, isValid, parseISO } from 'date-fns';

interface ExportData {
  patients: any[];
  consultations: any[];
  appointments: any[];
  activeTab: string;
}

const formatDate = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) {
      return 'Invalid Date';
    }
    return format(date, 'MMM d, yyyy');
  } catch {
    return 'Invalid Date';
  }
};

export const exportToPDF = ({ patients, consultations, appointments }: ExportData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  
  // Add header
  doc.setFontSize(20);
  doc.text('IMD-Care Report', pageWidth / 2, 15, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text(`Generated on: ${format(new Date(), 'MMM d, yyyy HH:mm')}`, pageWidth / 2, 25, { align: 'center' });
  
  // Patients Section
  if (patients.length > 0) {
    doc.text('Patient List', 14, 35);
    
    const patientsData = patients.map(patient => [
      patient.name,
      patient.mrn,
      patient.department,
      formatDate(patient.admission_date),
      patient.doctor_name || 'Not Assigned',
      patient.status
    ]);

    autoTable(doc, {
      startY: 40,
      head: [['Name', 'MRN', 'Department', 'Admission Date', 'Assigned Doctor', 'Status']],
      body: patientsData,
      theme: 'striped',
      headStyles: { fillColor: [63, 81, 181] },
      styles: { fontSize: 8 },
      columnStyles: {
        0: { cellWidth: 35 },
        1: { cellWidth: 25 },
        2: { cellWidth: 35 },
        3: { cellWidth: 25 },
        4: { cellWidth: 35 },
        5: { cellWidth: 20 }
      }
    });
  }

  // Consultations Section
  if (consultations.length > 0) {
    const startY = (doc as any).lastAutoTable?.finalY + 15 || 35;
    doc.text('Medical Consultations List', 14, startY);
    
    const consultationsData = consultations.map(consultation => [
      consultation.mrn,
      consultation.patient_name,
      consultation.age,
      consultation.gender,
      consultation.requesting_department,
      consultation.patient_location,
      consultation.consultation_specialty
    ]);

    autoTable(doc, {
      startY: startY + 5,
      head: [['MRN', 'Patient Name', 'Age', 'Gender', 'Requesting Dept', 'Location', 'Specialty']],
      body: consultationsData,
      theme: 'striped',
      headStyles: { fillColor: [63, 81, 181] },
      styles: { fontSize: 8 },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 35 },
        2: { cellWidth: 15 },
        3: { cellWidth: 20 },
        4: { cellWidth: 30 },
        5: { cellWidth: 25 },
        6: { cellWidth: 30 }
      }
    });
  }

  // Appointments Section
  if (appointments.length > 0) {
    const startY = (doc as any).lastAutoTable?.finalY + 15 || 35;
    doc.text('Clinic Appointments List', 14, startY);
    
    const appointmentsData = appointments.map(appointment => [
      appointment.patientName,
      appointment.medicalNumber,
      appointment.specialty,
      appointment.appointmentType,
      formatDate(appointment.createdAt)
    ]);

    autoTable(doc, {
      startY: startY + 5,
      head: [['Patient Name', 'Medical Number', 'Clinic Specialty', 'Type', 'Date']],
      body: appointmentsData,
      theme: 'striped',
      headStyles: { fillColor: [63, 81, 181] },
      styles: { fontSize: 8 },
      columnStyles: {
        0: { cellWidth: 40 },
        1: { cellWidth: 35 },
        2: { cellWidth: 40 },
        3: { cellWidth: 25 },
        4: { cellWidth: 35 }
      }
    });
  }

  // Add footer with page numbers
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(
      `Page ${i} of ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    );
  }

  // Save the PDF
  doc.save(`imd-care-report-${format(new Date(), 'yyyy-MM-dd-HHmm')}.pdf`);
};