package com.example.board;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.example.board.domain.BoardVO;
import com.example.board.mapper.BoardMapper;
import com.example.board.service.BoardService;

import lombok.extern.slf4j.Slf4j;

@SpringBootTest
@Slf4j
class BoardTestApplicationTests {

	@Autowired
	BoardMapper mapper;

	@Autowired
	BoardService service;

	@Test
	@Disabled
	void contextLoads() {
	}

	@Test
	//@Disabled
	void testMapper() {
		BoardVO vo = new BoardVO();

		vo.setContent("8번 내용수정");
		vo.setTitle("8번 제목수정");
		vo.setAuthor("신현제");

		System.out.println(mapper.update(8, vo));
		//log.info("result : " + mapper.findAll());

	}

	@Test
	@Disabled
	void testService() {
		log.info("result : " + service.findAll().toString());
		log.info("result : " + service.findByBoardSn(1).toString());

		BoardVO vo = new BoardVO();
		vo.setBoardSn(11);
		vo.setContent("내용입니다");
		vo.setTitle("제목입니다.");
		vo.setAuthor("신현제");

		log.info("result : " + service.save(vo));
	}

}
