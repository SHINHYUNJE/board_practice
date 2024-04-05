package com.example.board.service;

import java.util.List;

import com.example.board.domain.BoardVO;

public interface BoardService {

	List<BoardVO> findAll();

	BoardVO findByBoardSn(int boardSn);

	int save(BoardVO board);

	int update(int boardSn, BoardVO board);

	int delete(int boardSn);
}