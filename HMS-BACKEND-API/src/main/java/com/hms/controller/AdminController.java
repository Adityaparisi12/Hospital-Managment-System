package com.hms.controller;
import java.util.*;

//import javax.print.Doc;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hms.model.*;
import com.hms.model.Admin;
import com.hms.service.AdminService;

@RestController
@RequestMapping("/admin")
@CrossOrigin("*")
public class AdminController 
{
	@Autowired
	private AdminService adminService;
	
	@PostMapping("/checkadminlogin")
	public ResponseEntity<?> checkadminlogin(@RequestBody Admin admin)
	{
		try
		{
			Admin a=adminService.checkadminlogin(admin.getUsername(), admin.getPassword());
			
			if(a!=null)
			{
				return ResponseEntity.ok(a);
			}
			else
			{
				return ResponseEntity.status(401).body("Username Invalid or Passowrd");
			}
		}
		catch (Exception e)
		{
//			System.out.println(e.getMessage());
			return ResponseEntity.status(500).body("Login failed:"+e.getMessage());
		}
	}
	
	
	
	@GetMapping("/viewalldoctors")
	public ResponseEntity<List<Doctor>> viewalldoctors()
	{
		List<Doctor> doctors=adminService.displayalldoctors();
		return ResponseEntity.ok(doctors);
	}
	
	@PostMapping("/adddoctor")
	public ResponseEntity<String> adddoctor(@RequestBody Doctor doctor)
	{
		try
		{
			String output=adminService.apenddoctor(doctor);
			doctor.setApproved(true);
			return ResponseEntity.ok(output);
		}
		catch (Exception e) {
			return ResponseEntity.status(500).body("Failed to add Doctor");
		}
	}
	
	
	@GetMapping("/viewallpatients")
	public ResponseEntity<List<Patient>> viewallpatients()
	{
		List<Patient> patients=adminService.displayallpatients();
		return ResponseEntity.ok(patients);
	}

	@GetMapping("/viewallprescriptions")
	public ResponseEntity<List<Prescription>> viewallprescriptions()
	{
		List<Prescription> prescriptions = adminService.displayallprescriptions();
		return ResponseEntity.ok(prescriptions);
	}
	
	@DeleteMapping("/deletedoctor")
	public ResponseEntity<String> deletedoctor(@RequestParam int did)
	{
		try
		{
		 String output=adminService.deletedoctor(did);
		 return ResponseEntity.ok(output);
		}
		catch (Exception e) 
		{
			return ResponseEntity.status(500).body("Failed to delete Doctor");
		}
	}
   
	@DeleteMapping("/deletepatient")
	public ResponseEntity<String> deletepatient(@RequestParam int pid)
	{
		try
		{
			String output=adminService.deletepatient(pid);
			return ResponseEntity.ok(output);
		}
		catch (Exception e) 
		{
			return ResponseEntity.status(500).body("Failed to delete Patient");
			
		}
	}
	
	@GetMapping("/countpatients")
	public ResponseEntity<Long> countPatients()
	{
	 long count=adminService.displaypatientscount();
	 return ResponseEntity.ok(count);
	}
	
	@GetMapping("/countdoctors")
	public ResponseEntity<Long> countDoctors()
	{
		long count=adminService.displaydoctorscount(); 
		return ResponseEntity.ok(count);
	}
	
	@GetMapping("/countprescriptions")
	public ResponseEntity<Long> countPrescriptions()
	{
		long count=adminService.displayprescriptioncount();
		return ResponseEntity.ok(count);
	}
	
	@GetMapping("/pendingdoctors")
	public ResponseEntity<List<Doctor>> pendingDoctors() {
	    return ResponseEntity.ok(adminService.displayPendingDoctors());
	}

	@PostMapping("/approvedoctor")
	public ResponseEntity<String> approveDoctor(@RequestParam int did) {
	    return ResponseEntity.ok(adminService.approveDoctor(did));
	}

	@DeleteMapping("/rejectdoctor")
	public ResponseEntity<String> rejectDoctor(@RequestParam int did) {
	    return ResponseEntity.ok(adminService.rejectDoctor(did));
	}

	
	
 }
