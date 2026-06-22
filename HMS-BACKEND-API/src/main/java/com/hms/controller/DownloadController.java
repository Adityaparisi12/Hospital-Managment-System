package com.hms.controller;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/downloads")
@CrossOrigin("*")
public class DownloadController
{
	private static final Path BASE_DIR = Paths.get("uploads", "prescriptions");

	@GetMapping("/{fileName}")
	public ResponseEntity<?> download(@PathVariable String fileName)
	{
		try
		{
			if(fileName == null || fileName.contains("..") || fileName.contains("/") || fileName.contains("\\"))
				return ResponseEntity.status(400).body("Invalid file name");

			Path filePath = BASE_DIR.resolve(fileName).normalize();
			if(!filePath.startsWith(BASE_DIR))
				return ResponseEntity.status(400).body("Invalid file path");
			if(!Files.exists(filePath))
				return ResponseEntity.status(404).body("File not found");

			byte[] data = Files.readAllBytes(filePath);
			ByteArrayResource resource = new ByteArrayResource(data);

			return ResponseEntity.ok()
					.contentType(MediaType.APPLICATION_PDF)
					.header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\""+fileName+"\"")
					.contentLength(data.length)
					.body(resource);
		}
		catch (Exception e)
		{
			return ResponseEntity.status(500).body("Unable to download file: "+e.getMessage());
		}
	}
}
