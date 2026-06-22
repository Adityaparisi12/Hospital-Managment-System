package com.hms.service;

import java.util.*;
import com.hms.model.Admin;
import com.hms.model.Doctor;
import com.hms.model.Patient;
import com.hms.model.Prescription;


public interface AdminService 
{
     public Admin checkadminlogin(String username,String password);
     public String apenddoctor(Doctor doctor);
     public List<Doctor> displayalldoctors();
     public List<Patient> displayallpatients();
     public List<Prescription> displayallprescriptions();
     public String deletedoctor(int did);
     public String deletepatient(int pid);
     public String deleteprescrition(int preid);
     public long displaydoctorscount();
     public long displaypatientscount();
     public long displayprescriptioncount();
     public List<Doctor> displayPendingDoctors();
     public String approveDoctor(int did);
     public String rejectDoctor(int did);
     
     
}
