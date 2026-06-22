package com.hms.service;

import com.hms.model.Prescription;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;

@Service
public class PdfServiceImpl implements PdfService {

    @Override
    public byte[] generatePrescriptionPdf(Prescription p) {

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

        try {
            Document document = new Document();
            PdfWriter.getInstance(document, outputStream);

            document.open();

            // Title
            Font titleFont = new Font(Font.HELVETICA, 18, Font.BOLD);
            Paragraph title = new Paragraph("Medical Prescription", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);

            document.add(new Paragraph(" "));
            document.add(new Paragraph("Date: " + p.getPrescriptionDate()));
            document.add(new Paragraph(" "));

            // Doctor Details
            document.add(new Paragraph("Doctor Details"));
            document.add(new Paragraph("Name: " + p.getDoctorName()));
            document.add(new Paragraph("Specialization: " + p.getDoctorSpecialization()));
            document.add(new Paragraph(" "));

            // Patient Details
            document.add(new Paragraph("Patient Details"));
            document.add(new Paragraph("Name: " + p.getPatientName()));
            document.add(new Paragraph("Age: " + p.getPatientAge()));
            document.add(new Paragraph("Gender: " + p.getPatientGender()));
            document.add(new Paragraph(" "));

            // Medical Info
            document.add(new Paragraph("Diagnosis:"));
            document.add(new Paragraph(p.getDiagnosis()));
            document.add(new Paragraph(" "));

            document.add(new Paragraph("Medicines:"));
            document.add(new Paragraph(p.getMedicine()));
            document.add(new Paragraph(" "));

            document.add(new Paragraph("Dosage:"));
            document.add(new Paragraph(p.getDosage()));
            document.add(new Paragraph(" "));

            document.add(new Paragraph("Duration:"));
            document.add(new Paragraph(p.getDuration()));
            document.add(new Paragraph(" "));

            document.add(new Paragraph("Instructions:"));
            document.add(new Paragraph(p.getInstructions()));

            document.close();

        } catch (Exception e) {
            throw new RuntimeException("Error generating prescription PDF", e);
        }

        return outputStream.toByteArray();
    }
}
