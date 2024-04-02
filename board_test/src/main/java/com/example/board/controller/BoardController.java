package com.example.board.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

import com.example.board.domain.BoardVO;
import com.example.board.service.BoardService;

import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
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

	@GetMapping("/board/select/{boardSn}")
	public String select(@PathVariable("boardSn") int boardSn, Model model) {
		model.addAttribute("dto", service.findByBoardSn(boardSn));
		return "board/detail";
	}

	@GetMapping("/board/insert")
	public String insert() {
		return "board/write";
	}

	@PostMapping("/board/insert")
	public String insert_(BoardVO board) {
		service.save(board);
		return "redirect:/board/list";
	}

	@GetMapping("/board/update/{boardSn}")
	public String update(@PathVariable("boardSn") int boardSn, Model model) {
		model.addAttribute("dto", service.findByBoardSn(boardSn));
		return "/board/edit";
	}

	@PostMapping("/board/update")
	public String update_(BoardVO board) { // disabled 설정되있는 컬럼 안가져옴
		log.info("업데이트 : " + board.toString());
		service.update(board);
		return "redirect:/board/select/" + board.getBoardSn();
	}

	@GetMapping("/board/delete/{boardSn}")
	public String delete_(@PathVariable("boardSn") int boardSn) {
		service.delete(boardSn);
		return "redirect:/board/list";
	}

}
