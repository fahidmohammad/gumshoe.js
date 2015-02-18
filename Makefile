PATH  := node_modules/.bin:$(PATH)
SHELL := /bin/bash

target  := build/gumshoe.js

source_files := src/gumshoe.js


.PHONY: all clean test

all: $(target)

test: $(target)
	phantomjs phantom.js

clear:
	rm -rf build

$(target): $(source_files)
	uglifyjs -cmo $@ $^
