package com.example.board.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class AppController {

	@GetMapping("/")
	public String index() {
		return "index"; // src/main/resources/templates/index.html
	}
	
	@GetMapping("/test1")
	public String test1() {
		return "test"; // src/main/resources/templates/test.html
	}

}