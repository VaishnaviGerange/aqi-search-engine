let LRUConstructor;
try {
  const pkg = require('lru-cache');
  // pkg could be the constructor itself, or { default: constructor }, or { LRUCache: constructor }
  LRUConstructor = pkg && (pkg.default || pkg.LRUCache || pkg);
} catch (err) {
  // If require fails, throw a helpful message
  throw new Error('Failed to require lru-cache. Did you run `npm install` in backend? Original error: ' + err.message);
}

function createCache({ max = 200, ttl = 1000 * 60 * 10 } = {}) {
  // instantiate using whatever constructor we found
  const cache = new LRUConstructor({
    max,
    ttl,
    allowStale: false,
  });

  return {
    get: (key) => cache.get(key),
    set: (key, value) => cache.set(key, value),
    del: (key) => cache.delete(key),
    keys: () => cache.keys(),
    size: () => cache.size,
  };
}

module.exports = createCache;
