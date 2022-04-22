interface InEnvConfig {
  TEST: boolean;
  PRODUCTION: boolean;
  DEVELOPMENT: boolean;
  [key: string]: any;
}

const getEnvConfig = (): InEnvConfig => {
  const mode = process?.env?.NODE_ENV || 'production';
  const deployType = process?.env?.DEPLOY_TYPE || 'production';
  const modeConfig = {
    TEST: mode === 'test',
    PRODUCTION: mode === 'production',
    DEVELOPMENT: mode === 'development',
    deployType: deployType,
  };

  try {
    const base = require('../.env/base.env.json');
    let config = base ? { ...base, ...modeConfig } : modeConfig;

    if (mode === 'production' && deployType === 'production') config = { ...config, ...require('../.env/deploy-prod.env.json') };
    if (mode === 'production' && deployType === 'test') config = { ...config, ...require('../.env/deploy-test.env.json') };
    if (mode === 'development' && deployType === 'production') config = { ...config, ...require('../.env/dev-prod.env.json')};
    if (mode === 'test' && deployType === 'production') config = { ...config, ...require('../.env/test-prod.env.json')};
    if (mode === 'development' && deployType === 'test') config = { ...config, ...require('../.env/dev-test.env.json') };
    if (mode === 'test' && deployType === 'test') config = { ...config, ...require('../.env/test-test.env.json') };

    return config;
  } catch (err) {
    return modeConfig;
  }
};

export default getEnvConfig();
