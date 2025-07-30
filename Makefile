# Makefile for Next.js/TypeScript project linting

.PHONY: lint

lint:
	npx next lint --dir ./app --dir ./components --dir ./pages --dir ./src || exit 1
