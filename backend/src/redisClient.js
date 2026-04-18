import { Redis } from "@upstash/redis";



const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
});
console.log("Redis URL:", process.env.UPSTASH_REDIS_REST_URL);
console.log("Redis TOKEN:", process.env.UPSTASH_REDIS_REST_TOKEN);

export default redis;