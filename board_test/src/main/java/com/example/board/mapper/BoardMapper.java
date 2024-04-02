package com.example.board.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.example.board.domain.BoardVO;

@Mapper
public interface BoardMapper {
	List<BoardVO> findAll();

	BoardVO findByBoardSn(int boardSn);

	int insert(BoardVO board);

	int update(BoardVO board);

	int delete(int boardSn);
}