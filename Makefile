.PHONY: dev test help stop database console
.DEFAULT_GOAL: help

default: help

help: ## Output available commands
	@echo "Available commands:"
	@echo
	@fgrep -h "##" $(MAKEFILE_LIST) | fgrep -v fgrep | sed -e 's/\\$$//' | sed -e 's/##//'

database: ## Run a standalone database instance, mostly for debug porposes
	@docker run --name database -e MYSQL_USER=kudos -e MYSQL_ROOT_PASSWORD=wadus -e MYSQL_DATABASE=kudos -e MYSQL_PASSWORD=kudos -p 3306:3306 --rm mysql:5.7.25

console: ## Run a mysql console, mostly for debug porposes
	@docker exec -it database mysql -uroot -pwadus

dev: ## Run a development environment on port 5000
	@docker-compose build dev
	@docker-compose up --remove-orphans
	@docker-compose logs -f dev

test: ## Run the current test suite
	@docker-compose build test
	@docker-compose up --remove-orphans test

stop: ## Stop all the environments
	@docker-compose down
	@docker stop database