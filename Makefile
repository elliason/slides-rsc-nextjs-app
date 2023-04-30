include .env

CURRENT_UID = $(shell id -u)

install-slidev-packages:
	docker run --rm -v `pwd`/application:/var/www/html -u $(CURRENT_UID) $(NODE_DOCKER_IMAGE) bash -c "pnpm install";

run-node:
	docker run --rm -it -v `pwd`/application:/var/www/html -u $(CURRENT_UID) $(NODE_DOCKER_IMAGE) bash;

build-slidev:
	docker run --rm -v `pwd`/slidev:/var/www/html -u $(CURRENT_UID) $(NODE_DOCKER_IMAGE) bash -c "pnpm run build";

init:
	pnpm install && chmod +x -R ./cli;
	make install-slidev-packages;

start:
	./cli/start.js;

start-pull:
	./cli/start.js -p;

stop:
	./cli/stop.js;

restart:
	./cli/restart.js;

