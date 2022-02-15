const { create, getDefaultConfig } = require('enhanced-resolve-jest');

module.exports = create((jestConfig) => {
  return {
    ...getDefaultConfig(jestConfig),
    conditionNames: ['require'],
  };
});
