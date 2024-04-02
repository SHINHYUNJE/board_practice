package com.example.board.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.board.domain.BoardVO;
import com.example.board.mapper.BoardMapper;

@Service
public class BoardServiceImpl implements BoardService {

	private final BoardMapper boardMapper;

	@Autowired
	public BoardServiceImpl(BoardMapper boardMapper) {
		this.boardMapper = boardMapper;
	}

	@Override
	public List<BoardVO> findAll() {
		return boardMapper.findAll();
	}

	@Override
	public BoardVO findByBoardSn(int boardSn) {
		return boardMapper.findByBoardSn(boardSn);
	}

	@Override
	public int save(BoardVO board) {
		return boardMapper.insert(board);
	}

	@Override
	public int update(BoardVO board) {
		return boardMapper.update(board);
	}

	@Override
	public int delete(int boardSn) {
		return boardMapper.delete(boardSn);
	}

}
