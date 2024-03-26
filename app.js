const express = require('express');
const redis = require('redis');

// Create a Redis client
const redisClient = redis.createClient({
//   host: 'redis-server', // Assuming 'redis-server' is the hostname of your Redis container
//   port: 6379, // Default Redis port
        url:"redis://redis:6379"

});

redisClient.connect()

// Check if the Redis client is connected
redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

const app = express();

// Route that fetches data from Redis cache or from the API and caches the result
app.get('/data', async(req, res) => {
    console.log("initializing getting data...")
  // Check if data is cached in Redis
  try{
    
   let msg = await redisClient.get("key")
   if(!msg){
    res.send("No key in redis, but we are setting it up")
    await redisClient.set("key","Daniel",{
        EX:10
    })

   }else{
    res.send("Key already found in redis")
    
   }
}catch(e){
    console.log(`Error with redis :${e}`)
}
});

// Start the Express server
// redisClient.connect().then(()=>{
//     console.log("conencted to redis")
// })

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
