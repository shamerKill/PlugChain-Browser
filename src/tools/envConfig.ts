const envConfig = (): {[key: string]: any} => {
  try {
    const base = require('../.env/base.env.json');
    const production = require('../.env/production.env.json');
    const development = require('../.env/development.env.json');
    const test = require('../.env/test.env.json');

    const mode = process.env.NODE_ENV;

    let config = base ? { ...base } : {};
    if (mode === 'production') config = { ...config, ...production };
    else if (mode === 'development') config = { ...config, ...development};
    else if (mode === 'test') config = { ...config, ...test };
    return config;
  } catch (err) {
    return {};
  }
};

export default envConfig;
