package com.hms.repository;
import java.util.*;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hms.model.Doctor;

@Repository
public interface DoctorRepository  extends JpaRepository<Doctor, Integer>
{
	Doctor findByUsernameAndPasswordAndApprovedTrue(String username, String password);

    List<Doctor> findByApprovedFalse();

    
   
}
