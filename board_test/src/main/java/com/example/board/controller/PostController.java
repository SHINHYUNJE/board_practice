package com.example.board.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.board.domain.BoardVO;
import com.example.board.service.BoardService;

import lombok.extern.slf4j.Slf4j;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/boards")
@Slf4j
public class PostController {

	private final BoardService boardService;

	@Autowired
	public PostController(BoardService boardService) {
		this.boardService = boardService;
	}

	// 게시글 목록 조회
	@GetMapping
	@ResponseBody
	public Map<String, Object> getAllBoards() {
		log.info("list ...................");
		List<BoardVO> boards = boardService.findAll();
		Map<String, Object> response = new HashMap<>();
		response.put("status", "success");
		response.put("data", boards);
		return response;
	}

	// 게시글 상세 조회
	@GetMapping("/{boardSn}")
	@ResponseBody
	public Map<String, Object> getBoard(@PathVariable("boardSn") int boardSn) {
		// log.info("list ...................");

		BoardVO board = boardService.findByBoardSn(boardSn);
		Map<String, Object> response = new HashMap<>();
		if (board != null) {
			response.put("status", "success");
			response.put("data", board);
		} else {
			response.put("status", "error");
			response.put("message", "Board not found");
		}
		return response;
	}

	// 게시글 생성
	@PostMapping
	@ResponseBody
	public Map<String, Object> createBoard(@RequestBody BoardVO board) {
		log.info("create ...................");
		log.info("...." + board);

		int result = boardService.save(board);
		Map<String, Object> response = new HashMap<>();
		response.put("status", "success");
		response.put("data", result);
		return response;
	}

	// 게시글 수정
	@PutMapping("/{boardSn}")
	@ResponseBody
	public Map<String, Object> updateBoard(@PathVariable("boardSn") int boardSn, @RequestBody BoardVO board) {
		log.info("update ...................");
		log.info("...." + board);

		board.setBoardSn(boardSn); // 경로에서 받은 boardSn을 설정해야 합니다.

		int result = boardService.update(boardSn, board);
		Map<String, Object> response = new HashMap<>();
		if (result > 0) {
			response.put("status", "success");
			response.put("data", result);
		} else {
			response.put("status", "error");
			response.put("message", "Board not found");
		}
		return response;
	}

	// 게시글 삭제
	@DeleteMapping("/{boardSn}")
	@ResponseBody
	public Map<String, Object> deleteBoard(@PathVariable("boardSn") int boardSn) {
		log.info("delete ...................");
		log.info("....boardSn: " + boardSn);

		int isDeleted = boardService.delete(boardSn);
		Map<String, Object> response = new HashMap<>();
		if (isDeleted > 0) {
			response.put("status", "success");
			response.put("message", "Board deleted successfully");
		} else {
			response.put("status", "error");
			response.put("message", "Board not found");
		}
		return response;
	}

}