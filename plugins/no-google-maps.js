module.exports = (config) => {
    delete config.ios?.config?.googleMapsApiKey;
    return config;
  };
  