.PHONY: help install dev build preview lint docker-build docker-run docker-stop docker-clean clean

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

install: ## Install dependencies
	npm install

dev: ## Start development server
	npm run dev

build: ## Build for production
	npm run build

preview: ## Preview production build
	npm run preview

lint: ## Run linter
	npm run lint

docker-build: ## Build Docker image
	docker build -t aware:latest .

docker-run: ## Run Docker container
	docker run -d -p 8080:80 --name aware-app --restart unless-stopped aware:latest

docker-stop: ## Stop and remove Docker container
	docker stop aware-app || true
	docker rm aware-app || true

docker-clean: docker-stop ## Clean Docker container and images
	docker rmi aware:latest || true

docker-compose-up: ## Start with docker-compose
	docker-compose up -d

docker-compose-down: ## Stop docker-compose
	docker-compose down

docker-compose-logs: ## View docker-compose logs
	docker-compose logs -f

clean: ## Clean build artifacts
	rm -rf dist node_modules
	npm cache clean --force

all: clean install build ## Clean, install, and build

