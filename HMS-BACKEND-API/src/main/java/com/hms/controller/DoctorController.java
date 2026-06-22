package com.hms.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hms.model.Doctor;
import com.hms.service.DoctorService;
import com.hms.dto.PrescriptionRequest;
import com.hms.dto.PrescriptionResponse;
import com.hms.model.Prescription;

@RestController
@RequestMapping("/doctor")
@CrossOrigin("*")
public class DoctorController 
{
	@Autowired
	private DoctorService doctorServive;
	
	@PostMapping("/checkdoctorlogin")
	public ResponseEntity<?> checkdoctorlogin(@RequestBody Doctor doctor)
	{
		try
		{
			Doctor d = doctorServive.checkdoctorlogin(doctor.getUsername(), doctor.getPassword());
			if(d != null)
			{
				if(!d.isApproved())
				{
					return ResponseEntity.status(403).body("OOPS Admin Approval Pending");
				}
				return ResponseEntity.ok(d);
			}
			else
			{
				return ResponseEntity.status(401).body("Invalid username or password");
			}
		}
		catch (Exception e) 
		{
			return ResponseEntity.status(500).body("Login Invalid: " + e.getMessage());
		}
	}
	
	@PostMapping("/register")
	public ResponseEntity<String> doctorregistration(@RequestBody Doctor doctor)
	{
		try
		{
			doctor.setApproved(false);
			String output = doctorServive.doctorregistration(doctor);
			return ResponseEntity.ok(output);
		}
		catch (Exception e)
		{
			return ResponseEntity.status(500).body("Failed to Register: " + e.getMessage());
		}
	}
	
	@PostMapping("/updateprofile")
	public ResponseEntity<String> updateDoctorProfile(@RequestBody Doctor doctor)
	{
		try
		{
			String output = doctorServive.doctorupdateprofile(doctor);
			if(output.contains("not found"))
			{
				return ResponseEntity.status(404).body(output);
			}
			return ResponseEntity.ok(output);
		}
		catch (Exception e)
		{
			return ResponseEntity.status(500).body("Failed to update Doctor Profile: " + e.getMessage());
		}
	}

	@PostMapping("/addprescription")
	public ResponseEntity<?> addprescription(@RequestBody PrescriptionRequest request)
	{
		try
		{
			Prescription p = doctorServive.addprescription(request);
			if(p == null)
				return ResponseEntity.status(400).body("Unable to add prescription. Make sure the patient has an ACCEPTED appointment already examined.");
			PrescriptionResponse r = new PrescriptionResponse();
			r.setId(p.getId());
			r.setDoctorName(p.getDoctorName());
			r.setDoctorSpecialization(p.getDoctorSpecialization());
			r.setDiagnosis(p.getDiagnosis());
			r.setMedicine(p.getMedicine());
			r.setDosage(p.getDosage());
			r.setDuration(p.getDuration());
			r.setInstructions(p.getInstructions());
			r.setPrescriptionDate(p.getPrescriptionDate());
			r.setPdfPath(p.getPdfPath());
			return ResponseEntity.ok(r);
		}
		catch (Exception e)
		{
			return ResponseEntity.status(500).body("Failed to add prescription: "+e.getMessage());
		}
	}

	@GetMapping("/viewappointments")
	public ResponseEntity<?> viewappointments(@RequestParam int did)
	{
		try
		{
			return ResponseEntity.ok(doctorServive.viewappointments(did));
		}
		catch (Exception e) 
		{
			return ResponseEntity.status(500).body("Unable to fetch appointments: "+e.getMessage());
		}
	}

	@PutMapping("/acceptappointment")
	public ResponseEntity<?> acceptappointment(@RequestParam int bid, @RequestParam int did)
	{
		try
		{
			String output = doctorServive.acceptappointment(bid, did);
			if(output.contains("Denied") || output.contains("not Found") || output.contains("already"))
				return ResponseEntity.status(400).body(output);
			return ResponseEntity.ok(output);
		}
		catch (Exception e) 
		{
			return ResponseEntity.status(500).body("Unable to accept appointment: "+e.getMessage());
		}
	}

	@PutMapping("/rejectappointment")
	public ResponseEntity<?> rejectappointment(@RequestParam int bid, @RequestParam int did)
	{
		try
		{
			String output = doctorServive.rejectappointment(bid, did);
			if(output.contains("Denied") || output.contains("not Found") || output.contains("already"))
				return ResponseEntity.status(400).body(output);
			return ResponseEntity.ok(output);
		}
		catch (Exception e) 
		{
			return ResponseEntity.status(500).body("Unable to reject appointment: "+e.getMessage());
		}
	}

	@PutMapping("/completeappointment")
	public ResponseEntity<?> completeappointment(@RequestParam int bid, @RequestParam int did)
	{
		try
		{
			String output = doctorServive.completeappointment(bid, did);
			if(output.contains("Denied") || output.contains("not Found") || output.contains("Only") || output.contains("already") || output.contains("Invalid"))
				return ResponseEntity.status(400).body(output);
			return ResponseEntity.ok(output);
		}
		catch (Exception e) 
		{
			return ResponseEntity.status(500).body("Unable to complete appointment: "+e.getMessage());
		}
	}

	@PutMapping("/updateavailability")
	public ResponseEntity<?> updateavailability(@RequestParam int did, @RequestParam boolean available)
	{
		try
		{
			String output = doctorServive.updateavailability(did, available);
			if(output.contains("not found") || output.contains("Not found"))
				return ResponseEntity.status(404).body(output);
			return ResponseEntity.ok(output);
		}
		catch (Exception e) 
		{
			return ResponseEntity.status(500).body("Unable to update availability: "+e.getMessage());
		}
	}

}
