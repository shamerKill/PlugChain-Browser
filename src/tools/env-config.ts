interface InEnvConfig {
  TEST: boolean;
  PRODUCTION: boolean;
  DEVELOPMENT: boolean;
  [key: string]: any;
}

const getEnvConfig = ((): InEnvConfig => {
  const mode = process.env.NODE_ENV;
  const modeConfig = {
    TEST: mode === 'test',
    PRODUCTION: mode === 'production',
    DEVELOPMENT: mode === 'development',
  };

  try {
    const base = require('../.env/base.env.json');
    const production = require('../.env/production.env.json');
    const development = require('../.env/development.env.json');
    const test = require('../.env/test.env.json');
    let config = base ? { ...base, ...modeConfig } : modeConfig;

    if (mode === 'production') config = { ...config, ...production };
    else if (mode === 'development') config = { ...config, ...development};
    else if (mode === 'test') config = { ...config, ...test };

    return config;
  } catch (err) {
    return modeConfig;
  }
})();

export default getEnvConfig;
