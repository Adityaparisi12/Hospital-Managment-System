package com.hms;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class HmsBackendApiApplication 
{

	public static void main(String[] args) 
	{
		SpringApplication.run(HmsBackendApiApplication.class, args);
		System.out.println("HMS is Running");
	}

}
