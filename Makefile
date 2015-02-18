PATH  := node_modules/.bin:$(PATH)
SHELL := /bin/bash

target  := build/gumshoe.js

source_files := src/gumshoe.js


.PHONY: all clean test

all: $(target)

test: $(target)
	phantom-jasmine test/gumshoe-tests.js

clean:
	rm -rf build

$(target): $(source_files)
	mkdir -p build
	uglifyjs --comments -cmo $@ $^
