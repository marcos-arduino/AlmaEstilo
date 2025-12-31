const { overrideDevServer } = require('customize-cra');

const devServerConfig = () => config => {
  return {
    ...config,
    allowedHosts: 'all',
    // Otras configuraciones del servidor de desarrollo si son necesarias
  };
};

module.exports = {
  devServer: overrideDevServer(devServerConfig())
};
