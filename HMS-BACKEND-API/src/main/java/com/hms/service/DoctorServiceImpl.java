package com.hms.service;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hms.model.Doctor;
import com.hms.model.BookAppointment;
import com.hms.model.Appointment;
import com.hms.model.AppointmentStatus;
import com.hms.model.Patient;
import com.hms.model.Prescription;
import com.hms.dto.PrescriptionRequest;
import com.hms.repository.AppointmentRepository;
import com.hms.repository.BookAppointmentRepository;
import com.hms.repository.DoctorRepository;
import com.hms.repository.PatientRepository;
import com.hms.repository.PrescriptionRepository;

@Service
public class DoctorServiceImpl implements DoctorService
{
	@Autowired
	private DoctorRepository doctorRepository;
	
	@Autowired
	private PrescriptionRepository prescriptionRepository;

	@Autowired
	private BookAppointmentRepository bookAppointmentRepository;

	@Autowired
	private AppointmentRepository appointmentRepository;

	@Autowired
	private PatientRepository patientRepository;

	@Autowired
	private PdfService pdfService;

	private static final Path PRESCRIPTION_DIR = Paths.get("uploads", "prescriptions");
	
	

	@Override
	public String doctorregistration(Doctor doctor) 
	{
		if(doctor.getAvailable() == null)
			doctor.setAvailable(true);
		doctorRepository.save(doctor);
		return "Doctor Registered Successfully";
	}


	@Override
	public String addprescription(Prescription prescription)
	{
	  prescriptionRepository.save(prescription);
	  return "Prescription Added Successfully";
	}

	@Override
	public Prescription addprescription(PrescriptionRequest request)
	{
		if(request == null)
			return null;
		Doctor doctor = doctorRepository.findById(request.getDid()).orElse(null);
		if(doctor == null || !doctor.isApproved())
			return null;
		Patient patient = patientRepository.findById(request.getPid()).orElse(null);
		if(patient == null)
			return null;
		
		// Doctor can add prescription only after examination (i.e., an ACCEPTED appointment in the past)
		List<Appointment> accepted = appointmentRepository.findByDoctor_IdAndPatient_IdAndStatus(doctor.getId(), patient.getId(), AppointmentStatus.ACCEPTED);
		boolean examined = false;
		LocalDateTime now = LocalDateTime.now();
		for(Appointment a : accepted)
		{
			LocalDate ad = a.getAppointmentDate();
			LocalTime st = a.getStartTime();
			if(ad != null && st != null)
			{
				LocalDateTime start = LocalDateTime.of(ad, st);
				if(!start.isAfter(now))
				{
					examined = true;
					break;
				}
			}
		}
		if(!examined)
			return null;
		
		if(request.getDiagnosis() == null || request.getMedicine() == null || request.getDosage() == null || request.getDuration() == null || request.getInstructions() == null)
			return null;
		
		Prescription p = new Prescription();
		p.setDoctor(doctor);
		p.setPatient(patient);
		p.setPatientName(patient.getName());
		p.setPatientAge(patient.getAge());
		p.setPatientGender(request.getPatientGender() == null ? "N/A" : request.getPatientGender());
		p.setDoctorName(doctor.getName());
		p.setDoctorSpecialization(request.getDoctorSpecialization() == null ? "General" : request.getDoctorSpecialization());
		p.setDiagnosis(request.getDiagnosis());
		p.setMedicine(request.getMedicine());
		p.setDosage(request.getDosage());
		p.setDuration(request.getDuration());
		p.setInstructions(request.getInstructions());
		p.setPrescriptionDate(LocalDate.now());

		// Save first to get ID
		p = prescriptionRepository.save(p);
		
		try
		{
			Files.createDirectories(PRESCRIPTION_DIR);
			byte[] pdfBytes = pdfService.generatePrescriptionPdf(p);
			String fileName = "prescription_"+p.getId()+".pdf";
			Path filePath = PRESCRIPTION_DIR.resolve(fileName);
			Files.write(filePath, pdfBytes);
			p.setPdfPath(fileName);
			p = prescriptionRepository.save(p);
		}
		catch (Exception e)
		{
			// If pdf generation fails, keep prescription saved without pdfPath
		}
		return p;
	}

	@Override
	public String deleteprescription(int preid)
	{
		Optional<Prescription> presc=prescriptionRepository.findById(preid);
		if(presc.isPresent()) 
		{
			prescriptionRepository.deleteById(preid);
			return "Prescription deleted successfully";
		}
		else {
		return "Prescription ID not found";
		}
	}

	@Override
	public String updatepresciption(Prescription prescription)
	{
//		prescriptionRepository.save(prescription);
		return "Upadated the prescription";
	}

	@Override
	public Doctor checkdoctorlogin(String username, String password) {
	
		return doctorRepository.findByUsernameAndPasswordAndApprovedTrue(username, password);
	}


	@Override
	public String doctorupdateprofile(Doctor doctor)
	{
		try
		{
		if(doctorRepository.existsById(doctor.getId()))
		{
			Doctor existingDoctor = doctorRepository.findById(doctor.getId()).orElse(null);
			if(existingDoctor != null && doctor.getAvailable() == null)
				doctor.setAvailable(existingDoctor.getAvailable());
			doctorRepository.save(doctor);
		}
		else
			return "Doctor ID Not found";
		}
		catch (Exception e) 
		{
			return "Failed to update Doctor Profile"+e.getMessage();
		}
		return "Doctor Profile updated successfully";
	}

	@Override
	public String updateavailability(int did, boolean available)
	{
		Doctor doctor = doctorRepository.findById(did).orElse(null);
		if(doctor == null)
			return "Doctor ID Not found";
		doctor.setAvailable(available);
		doctorRepository.save(doctor);
		return available ? "Doctor marked as Available" : "Doctor marked as Not Available";
	}

	@Override
	public List<BookAppointment> viewappointments(int did)
	{
		return bookAppointmentRepository.findByAppointment_Doctor_Id(did);
	}

	@Override
	public String acceptappointment(int bid, int did)
	{
		BookAppointment bookAppointment = bookAppointmentRepository.findById(bid).orElse(null);
		if(bookAppointment == null)
			return "Booking ID not Found";
		Appointment appointment = bookAppointment.getAppointment();
		if(appointment == null || appointment.getDoctor() == null || appointment.getDoctor().getId() != did)
			return "Access Denied";
		if(!AppointmentStatus.PENDING.name().equalsIgnoreCase(bookAppointment.getStatus()))
			return "Appointment status already updated";
		
		bookAppointment.setStatus(AppointmentStatus.ACCEPTED.name());
		bookAppointmentRepository.save(bookAppointment);
		
		appointment.setStatus(AppointmentStatus.ACCEPTED);
		appointmentRepository.save(appointment);
		return "Appointment Accepted";
	}

	@Override
	public String rejectappointment(int bid, int did)
	{
		BookAppointment bookAppointment = bookAppointmentRepository.findById(bid).orElse(null);
		if(bookAppointment == null)
			return "Booking ID not Found";
		Appointment appointment = bookAppointment.getAppointment();
		if(appointment == null || appointment.getDoctor() == null || appointment.getDoctor().getId() != did)
			return "Access Denied";
		if(!AppointmentStatus.PENDING.name().equalsIgnoreCase(bookAppointment.getStatus()))
			return "Appointment status already updated";
		
		bookAppointment.setStatus(AppointmentStatus.REJECTED.name());
		bookAppointmentRepository.save(bookAppointment);
		
		appointment.setStatus(AppointmentStatus.REJECTED);
		appointmentRepository.save(appointment);
		return "Appointment Rejected";
	}

	@Override
	public String completeappointment(int bid, int did)
	{
		BookAppointment bookAppointment = bookAppointmentRepository.findById(bid).orElse(null);
		if(bookAppointment == null)
			return "Booking ID not Found";
		Appointment appointment = bookAppointment.getAppointment();
		if(appointment == null || appointment.getDoctor() == null || appointment.getDoctor().getId() != did)
			return "Access Denied";
		
		String status = bookAppointment.getStatus();
		if(status == null)
			return "Invalid Status";
		String normalized = status.trim().toUpperCase();
		if(AppointmentStatus.COMPLETED.name().equals(normalized))
			return "Appointment already completed";
		if(!AppointmentStatus.ACCEPTED.name().equals(normalized))
			return "Only accepted appointments can be completed";
		
		bookAppointment.setStatus(AppointmentStatus.COMPLETED.name());
		bookAppointmentRepository.save(bookAppointment);
		
		appointment.setStatus(AppointmentStatus.COMPLETED);
		appointmentRepository.save(appointment);
		return "Appointment Completed";
	}

}
