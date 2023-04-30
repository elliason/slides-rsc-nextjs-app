#!/usr/bin/env node
import path from 'path';
import { Command } from 'commander';
import { startPlatypusProject } from '@platypus-stack/platypus-infra-tools';
import { getExpandedEnvVars, checkForEnvVarsInObject, dirname } from '@platypus-stack/platypus-app-tools';

const program = new Command();

program.option(
    `-p, --pull`,
    `docker-compose pull. Pulls an image associated with a service defined in a docker-compose. yml file that defines the service`
);

program.parse(process.argv);
const options = program.opts();

const rootPath = path.join(dirname(import.meta.url), '/../');
const envFilePath = path.normalize(rootPath + './.env');

const envVars = getExpandedEnvVars(envFilePath);

checkForEnvVarsInObject(['DOCKER_NETWORK', 'ENVIRONMENT_TYPE'], envVars);

const dockerNetworkName = envVars.DOCKER_NETWORK;
const environmentType = envVars.ENVIRONMENT_TYPE ?? 'local';

const dockerComposePath = path.normalize(rootPath + `./docker-compose.${environmentType}.yml`);

startPlatypusProject({
    dockerNetworkName,
    dockerComposePath,
    pull: options.pull,
});
