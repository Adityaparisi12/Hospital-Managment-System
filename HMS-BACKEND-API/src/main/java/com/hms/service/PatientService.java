package com.hms.service;

import java.util.List;

import com.hms.model.Appointment;
import com.hms.model.BookAppointment;
import com.hms.model.Patient;
import com.hms.dto.BookAppointmentRequest;

public interface PatientService 
{
	public Patient checkpatientlogin(String username,String password);
	public String patientregistration(Patient patient);
	public String bookappointment(BookAppointmentRequest request);
	public String updatepatientprofile(Patient patient);
	public Appointment getAppointmentById(int aid);
	public List<BookAppointment> getbookedappointmentsByPatient(int pid);
	public String cancelappointment(int bid, int pid);
	
	
	

}
