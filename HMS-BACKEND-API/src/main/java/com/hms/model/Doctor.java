package com.hms.model;



import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "doctor_table")

public class Doctor 
{
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "doctor_id")
	private int id;
	@Column(name="doctor_name",nullable = false,length = 100)
	private String name;
	@Column(name="doctor_licenseid",nullable = false,length = 10)
	private String licenseid;
	@Column(name="doctor_email",nullable = false,length = 100,unique = true)
	private String email;
	@Column(name = "doctor_contact",nullable = false,length =10,unique = true)
	private String contact;
	@Column(name="doctor_username",nullable = false,length = 50,unique = true)
	private String username;
	@Column(name="doctor_password",nullable = false,length = 50)
	private String password;
	@Column(name="doctor_approved",nullable = false)
	private boolean approved;
	@Column(name="doctor_available")
	private Boolean available;
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getLicenseid() {
		return licenseid;
	}
	public void setLicenseid(String licenseid) {
		this.licenseid = licenseid;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getContact() {
		return contact;
	}
	public void setContact(String contact) {
		this.contact = contact;
	}
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String passowrd) {
		this.password = passowrd;
	}
	public boolean isApproved() {
		return approved;
	}
	public void setApproved(boolean approved) {
		this.approved = approved;
	}
	public Boolean getAvailable() {
		return available;
	}
	public void setAvailable(Boolean available) {
		this.available = available;
	}
	

}
