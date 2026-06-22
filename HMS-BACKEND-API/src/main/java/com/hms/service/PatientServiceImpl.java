package com.hms.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hms.model.Appointment;
import com.hms.model.AppointmentStatus;
import com.hms.model.BookAppointment;
import com.hms.model.Doctor;
import com.hms.model.Patient;
import com.hms.repository.AppointmentRepository;
import com.hms.repository.BookAppointmentRepository;
import com.hms.repository.DoctorRepository;
import com.hms.repository.PatientRepository;
import com.hms.dto.BookAppointmentRequest;

@Service
public class PatientServiceImpl implements PatientService

{
    @Autowired
	private PatientRepository patientRepository;
    
    @Autowired
    private AppointmentRepository appointmentRepository;
    
    @Autowired
    private BookAppointmentRepository bookAppointmentRepository;

	@Autowired
	private DoctorRepository doctorRepository;

	@Override
	public Patient checkpatientlogin(String username, String password) 
	{
		
		return patientRepository.findByUsernameAndPassword(username, password);
	}

	@Override
	public String patientregistration(Patient patient) 
	{
		 patientRepository.save(patient);
		 return "Patient Registered Successfully";
	}

	@Override
	public String bookappointment(BookAppointmentRequest request) 
	{
		if(request == null)
			return "Invalid Request";
		
		Patient patient = patientRepository.findById(request.getPid()).orElse(null);
		if(patient == null)
			return "PatientID not Found";
		
		Doctor doctor = doctorRepository.findById(request.getDid()).orElse(null);
		if(doctor == null)
			return "DoctorID not Found";
		if(!doctor.isApproved())
			return "OOPS Admin Approval Pending";
		if(doctor.getAvailable() != null && !doctor.getAvailable())
			return "Doctor not available";
		
		if(request.getAppointmentDate() == null || request.getStartTime() == null || request.getEndTime() == null)
			return "Invalid Date/Time";
		
		LocalDate appointmentDate;
		LocalTime startTime;
		LocalTime endTime;
		try
		{
			appointmentDate = LocalDate.parse(request.getAppointmentDate());
			startTime = LocalTime.parse(request.getStartTime());
			endTime = LocalTime.parse(request.getEndTime());
		}
		catch (Exception e) 
		{
			return "Invalid Date/Time Format";
		}
		
		if(!startTime.isBefore(endTime))
			return "Start time must be before End time";
		
		LocalDate today = LocalDate.now();
		if(appointmentDate.isBefore(today))
			return "Appointment date must be today or later";
		
		// Skip slots that were already rejected/cancelled/completed so patients can rebook them.
		List<Appointment> existing = appointmentRepository.findByDoctor_IdAndAppointmentDate(doctor.getId(), appointmentDate);
		for(Appointment a : existing)
		{
			AppointmentStatus status = a.getStatus();
			boolean slotStillActive = status == null
				|| status == AppointmentStatus.PENDING
				|| status == AppointmentStatus.ACCEPTED;
			if(slotStillActive)
			{
				boolean overlaps = startTime.isBefore(a.getEndTime()) && endTime.isAfter(a.getStartTime());
				if(overlaps)
					return "Requested slot is not available";
			}
		}
		
		Appointment appointment = new Appointment();
		appointment.setDoctor(doctor);
		appointment.setPatient(patient);
		appointment.setAppointmentDate(appointmentDate);
		appointment.setStartTime(startTime);
		appointment.setEndTime(endTime);
		appointment.setStatus(AppointmentStatus.PENDING);
		appointmentRepository.save(appointment);
		
		BookAppointment bookappointment = new BookAppointment();
		bookappointment.setAppointment(appointment);
		bookappointment.setPatient(patient);
		bookappointment.setStatus(AppointmentStatus.PENDING.name());
		bookAppointmentRepository.save(bookappointment);
		
		return "Appointment Booked Successfully";
	}

	@Override
	public Appointment getAppointmentById(int aid)
	{
		return appointmentRepository.findById(aid).orElse(null);
	}

	@Override
	public List<BookAppointment> getbookedappointmentsByPatient(int pid)
	{
		Patient patient=patientRepository.findById(pid).orElse(null);
		return bookAppointmentRepository.findByPatient(patient);
	}

	@Override
	public String updatepatientprofile(Patient patient) {
		patientRepository.save(patient);
		return "Patient Profile updated";
	}

	@Override
	public String cancelappointment(int bid, int pid)
	{
		BookAppointment booking = bookAppointmentRepository.findById(bid).orElse(null);
		if(booking == null)
			return "Booking ID not Found";
		if(booking.getPatient() == null || booking.getPatient().getId() != pid)
			return "Access Denied";
		
		String currentStatus = booking.getStatus();
		if(currentStatus == null)
			return "Invalid Status";
		
		String normalized = currentStatus.trim().toUpperCase();
		if(AppointmentStatus.CANCELLED.name().equals(normalized))
			return "Appointment already cancelled";
		if(AppointmentStatus.REJECTED.name().equals(normalized))
			return "Rejected appointments cannot be cancelled";
		
		Appointment appointment = booking.getAppointment();
		if(appointment == null)
			return "Appointment not Found";

		// Prevent cancelling if the appointment already started in the past.
		try
		{
			LocalDate adate = appointment.getAppointmentDate();
			LocalTime stime = appointment.getStartTime();
			if(adate != null && stime != null)
			{
				LocalDateTime start = LocalDateTime.of(adate, stime);
				if(start.isBefore(LocalDateTime.now()))
					return "Cannot cancel past appointments";
			}
		}
		catch (Exception e) {
			// ignore parsing edge cases; fallback to allowing cancellation
		}
		
		booking.setStatus(AppointmentStatus.CANCELLED.name());
		bookAppointmentRepository.save(booking);
		
		appointment.setStatus(AppointmentStatus.CANCELLED);
		appointmentRepository.save(appointment);
		
		return "Appointment Cancelled";
	}
    
    

}
