package com.hms.service;

import java.util.List;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hms.model.Admin;
import com.hms.model.Doctor;
import com.hms.model.Patient;
import com.hms.model.Prescription;
import com.hms.repository.AdminRepository;
import com.hms.repository.DoctorRepository;
import com.hms.repository.PatientRepository;
import com.hms.repository.PrescriptionRepository;

@Service
public class AdminServiceImpl implements AdminService
{
	@Autowired
	private AdminRepository adminRepository;
	
	@Autowired
	private DoctorRepository doctorRepository;
	
	@Autowired
	private PrescriptionRepository prescriptionRepository;
	
	@Autowired
	private PatientRepository patientRepository;

	@Override
	public Admin checkadminlogin(String username, String password) 
	{
		return adminRepository.findByUsernameAndPassword(username, password);
	}

	@Override
	public String apenddoctor(Doctor doctor)
	{
		doctorRepository.save(doctor);
		return "Doctor Added Successfully";
	}

	@Override
	public List<Doctor> displayalldoctors()
	{
		return doctorRepository.findAll();
	}

	@Override
	public List<Patient> displayallpatients() 
	{
		return patientRepository.findAll();
	}

	@Override
	public List<Prescription> displayallprescriptions()
	{
		return prescriptionRepository.findAll();
	}

	@Override
	public String deletedoctor(int did) 
	{
	   Optional<Doctor> doctor=doctorRepository.findById(did);
	   if(doctor.isPresent())
	   {
		   doctorRepository.deleteById(did);
	       return "Deleted Doctor Successfully";
	   }
	   else
	   {
		return "Doctor ID Not Found";
	   }
	}
	@Override
	public String deletepatient(int pid)
	{
	   Optional<Patient> patient=patientRepository.findById(pid);
	   if(patient.isPresent()) 
	   {
		   patientRepository.deleteById(pid);
		   return "Deleted Patient Successfully";
	   }
	   else {
		return "Patient ID Not Found";
	}
	}

	@Override
	public String deleteprescrition(int preid) 
	{
		Optional<Prescription> prescription=prescriptionRepository.findById(preid);
		if(prescription.isPresent())
		{
			prescriptionRepository.deleteById(preid);
			return "Deleted Prescription  Successfully";
		}
		else
		{
			return "Prescription ID Not Found";
		}
		
		
	}

	@Override
	public long displaydoctorscount()
	{
		return doctorRepository.count();
	}

	@Override
	public long displaypatientscount() 
	{
		return patientRepository.count();
	}

	@Override
	public long displayprescriptioncount() 
	{
		return prescriptionRepository.count();
	}
	
	@Override
	public List<Doctor> displayPendingDoctors() {
	    return doctorRepository.findByApprovedFalse();
	}

	@Override
	public String approveDoctor(int did) {
	    Optional<Doctor> doctor = doctorRepository.findById(did);
	    if (doctor.isPresent()) {
	        Doctor d = doctor.get();
	        d.setApproved(true);
	        doctorRepository.save(d);
	        return "Doctor Approved Successfully";
	    }
	    return "Doctor ID Not Found";
	}

	@Override
	public String rejectDoctor(int did) {
	    if (doctorRepository.existsById(did)) {
	        doctorRepository.deleteById(did);
	        return "Doctor Rejected Successfully";
	    }
	    return "Doctor ID Not Found";
	}

	


}
