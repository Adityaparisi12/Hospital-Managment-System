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

import com.hms.dto.BookAppointmentRequest;
import com.hms.dto.PrescriptionResponse;
import com.hms.model.Patient;
import com.hms.repository.PatientRepository;
import com.hms.repository.PrescriptionRepository;
import com.hms.service.PatientService;
import com.hms.model.Prescription;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/patient")
@CrossOrigin("*")

public class PatientController 
{
	@Autowired
	private PatientService patientService;
	
	@Autowired
	private PatientRepository patientRepository;

	@Autowired
	private PrescriptionRepository prescriptionRepository;
	

	
	
@PostMapping("/checkpatientlogin")	
public   ResponseEntity<?> checkpatientlogin(@RequestBody Patient patient)
{
 Patient p=patientService.checkpatientlogin(patient.getUsername(), patient.getPassword());
 try
 {
   if(p!=null)
    {
	 return ResponseEntity.ok(p);
    }
    else
  {
	 return ResponseEntity.status(401).body("Invalid Username or Password");
   }
 }
 catch (Exception e) {
	return ResponseEntity.status(500).body("Login Invalid"+e.getMessage());
 }
}

@PostMapping("/patientregister")
public ResponseEntity<String> patientregister(@RequestBody Patient patient)
{
	try {
		 String output=patientService.patientregistration(patient);
		return ResponseEntity.ok(output);
	}
	catch (Exception e) {
		return ResponseEntity.status(500).body("Failed to Register"+e.getMessage());
	}
}
	
@PutMapping("/updatepatientprofile")
public ResponseEntity<?> updatepatientprofile(@RequestBody Patient patient)
{
	try {
		if(patientRepository.existsById(patient.getId()))
		{
			patientService.updatepatientprofile(patient);
			Patient updatedPatient = patientRepository.findById(patient.getId()).orElse(null);
			return ResponseEntity.status(200).body(updatedPatient);
		}
		else
		{
			return ResponseEntity.status(404).body("PatientID not Found");
		}
	} catch (Exception e) {
		return ResponseEntity.status(500).body("Failed to update Profile: " + e.getMessage());
	}
}

@PostMapping("/bookappointment")
public ResponseEntity<?> bookappointment(@RequestBody BookAppointmentRequest request)
{
	try {
		String output=patientService.bookappointment(request);
		if(output == null)
			return ResponseEntity.status(400).body("Invalid Request");
		if(output.contains("not Found") || output.contains("Invalid") || output.contains("not available") || output.contains("Pending") || output.contains("must"))
			return ResponseEntity.status(400).body(output);
		return ResponseEntity.ok(output);
		
	} catch (Exception e) {
		return ResponseEntity.status(500).body("Couldn't book appointment"+e.getMessage());
	}
	
}

@GetMapping("/myappointments")
public ResponseEntity<?> myappointments(@RequestParam int pid)
{
	try
	{
		return ResponseEntity.ok(patientService.getbookedappointmentsByPatient(pid));
	}
	catch (Exception e) 
	{
		return ResponseEntity.status(500).body("Unable to fetch appointments: "+e.getMessage());
	}
}

@PutMapping("/cancelappointment")
public ResponseEntity<?> cancelappointment(@RequestParam int bid, @RequestParam int pid)
{
	try
	{
		String output = patientService.cancelappointment(bid, pid);
		if(output.contains("Denied") || output.contains("not Found") || output.contains("cannot") || output.contains("already") || output.contains("Invalid") || output.contains("Rejected"))
			return ResponseEntity.status(400).body(output);
		return ResponseEntity.ok(output);
	}
	catch (Exception e)
	{
		return ResponseEntity.status(500).body("Unable to cancel appointment: "+e.getMessage());
	}
}

@GetMapping("/myprescriptions")
public ResponseEntity<?> myprescriptions(@RequestParam int pid)
{
	try
	{
		List<Prescription> list = prescriptionRepository.findByPatient_IdOrderByPrescriptionDateDesc(pid);
		List<PrescriptionResponse> out = new ArrayList<>();
		for(Prescription p : list)
		{
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
			out.add(r);
		}
		return ResponseEntity.ok(out);
	}
	catch (Exception e)
	{
		return ResponseEntity.status(500).body("Unable to fetch prescriptions: "+e.getMessage());
	}
}

	
	

}
