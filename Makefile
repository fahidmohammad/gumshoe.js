PATH  := node_modules/.bin:$(PATH)
SHELL := /bin/bash

target := build/gumshoe.js

source_files := src/gumshoe.js

spec_files := test/gumshoe_spec.js


.PHONY: all clean test

all: $(target)

test: $(target) $(spec_files)
	phantom-jasmine $^

clean:
	rm -rf build

$(target): $(source_files)
	mkdir -p build
	uglifyjs --comments -cmo $@ $^
