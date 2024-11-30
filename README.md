Basic rate-limiting middleware for Express. it limits based on the ip address, this is done for learning purpose and is not meant to be run in production.

# Usage

```javascript
import express from "express"
import simpleRateLimiter from "@mohammedelmor/simple_rate_limiter_middleware"

const app = express()

/* function simpleRateLimiter(bucketSize = 5, refillDuration = 7000,
                            inactiveWindowDurationCheck = 10000, maxInactiveDuration = 60000) */

app.use(simpleRateLimiter())

app.get("/", (req, res) => {
    res.send("Hello")
})

app.listen(3000, "0.0.0.0", () => {
    console.log("The app is running on port: 3000")
})

```
