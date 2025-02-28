ifneq (,$(wildcard .env))
    include .env
endif

PWD=$(shell pwd)
NODE_IMAGE=node:20.18.2
IMAGE_NAME=data-nordeste-frontend
CONTAINER_PORT=3000

# PROD Env
HOST_PORT_PROD=3000
CONTAINER_NAME_PROD=data-nordeste-frontend-app

run-prod:
	npm run build
	npm run start

docker-build-dev:
	docker build -t $(IMAGE_NAME) .

docker-run-dev:
	docker run -p 3000:$(CONTAINER_PORT) --name $(IMAGE_NAME) -v node_modules -v $(PWD):/app --user 0:0 $(IMAGE_NAME)

docker-build-prod:
	docker build \
		--build-arg NEXT_PUBLIC_POWERBI_CLIENT_ID=${NEXT_PUBLIC_POWERBI_CLIENT_ID} \
		--build-arg NEXT_PUBLIC_POWERBI_CLIENT_SECRET=${NEXT_PUBLIC_POWERBI_CLIENT_SECRET} \
		--build-arg NEXT_PUBLIC_POWERBI_TENANT_ID=${NEXT_PUBLIC_POWERBI_TENANT_ID} \
		--build-arg NEXT_PUBLIC_POWERBI_WORKSPACE_ID=${NEXT_PUBLIC_POWERBI_WORKSPACE_ID} \
		--build-arg NEXT_PUBLIC_POWERBI_REPORTS_ID='${NEXT_PUBLIC_POWERBI_REPORTS_ID}' \
		-t $(IMAGE_NAME) -f Dockerfile.production .

docker-run-prod:
	docker run --name $(CONTAINER_NAME_PROD) -p $(HOST_PORT_PROD):$(CONTAINER_PORT) -d --restart always $(IMAGE_NAME)
