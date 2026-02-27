all: run

build:
	docker compose build

up:
	docker compose up -d

rebuild:
	docker compose down
	docker compose build
	docker compose up -d

logs:
	docker compose logs -f

run: rebuild

clean:
	docker compose down -v 

.PHONY: all build up down rebuild logs run clean
