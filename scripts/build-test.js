'use strict';

process.env.BUILD_PATH = 'build/test';
process.env.DEPLOY_TYPE = 'test';

require('./build');