#!/usr/bin/env node
import shell from 'shelljs';
import path from 'path';
import { infoLog, dirname } from '@platypus-stack/platypus-app-tools';

const rootPath = path.join(dirname(import.meta.url), '/../');

infoLog('================= STOP =================');
shell.exec(`${rootPath}/cli/stop.js`);
infoLog('================= START =================');
shell.exec(`${rootPath}/cli/start.js`);
