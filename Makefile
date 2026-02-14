# Makefile for Next.js/TypeScript project

.PHONY: lint
lint:
	npx eslint . || exit 1

.PHONY: build
build:
	npx next build || exit 1

.PHONY: clean
clean:
	rm -rf .next out/

.PHONY: dev
dev:
	npm run dev

.PHONY: update-deps
update-deps:
	npx npm-check-updates --target latest -u -x eslint && npm install
