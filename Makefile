PATH  := node_modules/.bin:$(PATH)
SHELL := /bin/bash

target := build/gumshoe.js

source_files := src/gumshoe.js

test_files := test/TestRunner.html


.PHONY: all clean test

all: $(target)

test: $(target) $(test_files)
	phantomjs test/run-jasmine.js $(test_files)

clean:
	rm -rf build

$(target): $(source_files)
	mkdir -p build
	uglifyjs --comments -cmo $@ $^
