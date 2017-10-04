ROOT_DIR:=$(shell dirname $(realpath $(lastword $(MAKEFILE_LIST))))

test:
	./node_modules/.bin/mocha --reporter spec

test-watch:
#	./node_modules/.bin/mocha -w --reporter nyan
	./node_modules/.bin/mocha -w --reporter spec

.PHONY: test test-watch