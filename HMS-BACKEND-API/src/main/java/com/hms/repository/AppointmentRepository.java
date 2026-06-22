package com.hms.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hms.model.Appointment;
import com.hms.model.AppointmentStatus;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment,Integer> 
{
	List<Appointment> findByDoctor_Id(int did);
	List<Appointment> findByPatient_Id(int pid);
	List<Appointment> findByDoctor_IdAndAppointmentDate(int did, LocalDate appointmentDate);
	List<Appointment> findByDoctor_IdAndPatient_IdAndStatus(int did, int pid, AppointmentStatus status);

}
