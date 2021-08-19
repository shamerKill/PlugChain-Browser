'use strict';

process.env.BUILD_PATH = 'build/production';
process.env.DEPLOY_TYPE = 'test';

require('./build');