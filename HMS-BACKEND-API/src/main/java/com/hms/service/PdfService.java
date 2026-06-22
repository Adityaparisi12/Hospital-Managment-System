package com.hms.service;

import com.hms.model.Prescription;

public interface PdfService 
{

    byte[] generatePrescriptionPdf(Prescription prescription);

}
