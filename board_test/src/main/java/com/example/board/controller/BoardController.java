package com.example.board.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.example.board.service.BoardService;

@Controller
public class BoardController {

	private final BoardService service;

	@Autowired
	public BoardController(BoardService service) {
		this.service = service;
	}

	@GetMapping("/board/list")
	public String list(Model model) {
		model.addAttribute("list", service.findAll());
		return "board/list";
	}

	@GetMapping("/board/select/{bno}")
	public String select(int bno, Model model) {

		return "board/detail";
	}

}
