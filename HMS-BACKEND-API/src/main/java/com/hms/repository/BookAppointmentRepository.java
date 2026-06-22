	package com.hms.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hms.model.BookAppointment;
import com.hms.model.Patient;

@Repository
public interface BookAppointmentRepository extends JpaRepository<BookAppointment, Integer>
{
	List<BookAppointment> findByPatient(Patient patient);
	List<BookAppointment> findByAppointment_Doctor_Id(int did);
	List<BookAppointment> findByAppointment_Doctor_IdAndStatus(int did, String status);

}
