package com.hms.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hms.model.Prescription;

@Repository
public interface PrescriptionRepository extends JpaRepository<Prescription, Integer>
{
	List<Prescription> findByPatient_IdOrderByPrescriptionDateDesc(int pid);

}
