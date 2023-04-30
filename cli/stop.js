#!/usr/bin/env node
import path from 'path';
import { stopPlatypusProject } from '@platypus-stack/platypus-infra-tools';
import { getExpandedEnvVars, checkForEnvVarsInObject, dirname } from '@platypus-stack/platypus-app-tools';

const rootPath = path.join(dirname(import.meta.url), '/../');
const envFilePath = path.normalize(rootPath + './.env');

const envVars = getExpandedEnvVars(envFilePath);

checkForEnvVarsInObject(['DOCKER_NETWORK', 'ENVIRONMENT_TYPE'], envVars);

const dockerNetworkName = envVars.DOCKER_NETWORK;
const environmentType = envVars.ENVIRONMENT_TYPE ?? 'local';

const dockerComposePath = path.normalize(rootPath + `./docker-compose.${environmentType}.yml`);

stopPlatypusProject({ dockerNetworkName, dockerComposePath });
