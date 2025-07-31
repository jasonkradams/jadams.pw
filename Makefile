# Makefile for Next.js/TypeScript project linting

.PHONY: lint build dev clean

lint:
	npx next lint --dir ./app --dir ./components --dir ./pages --dir ./src || exit 1

build:
	npx next build || exit 1

clean:
	rm -rf .next out/

dev:
	npm run dev
