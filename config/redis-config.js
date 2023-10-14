const redis = require("redis");

const redisClientCache = redis.createClient({
    url: 'redis://cache.akarahub.tech:6379'
});
(async () => await redisClientCache.connect())();
redisClient.on('ready', () => console.log("<< ----👌|= Connection to cache is completed ✔ ")); redisClientCache.on('ready', () => console.log("connect to cache3 successfully"));
redisClient.on('error', (err) => console.log("<< ---🤢 |= The connection to the cache has been raised error 💥")); redisClientCache.on('error', (err) => console.log("error during connecting to redis server ..."));
module.exports = {
    redisClientCache
}