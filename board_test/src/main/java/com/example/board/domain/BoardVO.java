package com.example.board.domain;

import lombok.Data;

@Data
public class BoardVO {
	private int boardSn;
	private String title;
	private String content;
	private String author;
	private String createdAt;
}
