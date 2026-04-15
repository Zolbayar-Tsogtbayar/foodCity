// Intercept config-shared to trace defaultConfig access
const Module = require('module');
const orig = Module._load;
Module._load = function(name, ...args) {
  const mod = orig.call(this, name, ...args);
  if (name.includes('config-shared') && mod.defaultConfig) {
    const orig_gbi = Object.getOwnPropertyDescriptor(mod.defaultConfig, 'generateBuildId');
    if (orig_gbi) {
      console.error('[HOOK] config-shared loaded, generateBuildId type:', typeof mod.defaultConfig.generateBuildId);
    }
  }
  return mod;
};
