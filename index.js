function simpleRateLimiter(bucketSize = 5, refillDuration = 7000,
                           inactiveWindowDurationCheck = 10000, maxInactiveDuration = 60000) {

    const IPS = {}
    const BUCKET_SIZE = bucketSize;
    const REFILL_DURATION = refillDuration;
    const INACTIVE_WINDOW_DURATION_CHECK = inactiveWindowDurationCheck;
    const MAX_INACTIVE_DURATION = maxInactiveDuration;

    function removeInactive() {
        setInterval(() => {
            for (const ip in IPS) {
                const difference = new Date() - IPS[ip].lastVisit;
                console.log(`difference ${difference} for ip: ${ip}`)
                if (difference >= MAX_INACTIVE_DURATION) {
                    console.log(`Removing ${ip} as it has been inactive for a while`)
                    delete IPS[ip]
                }
            }
        }, INACTIVE_WINDOW_DURATION_CHECK)
    }

    function refillTokens() {
        setInterval(() => {
            for (const ip in IPS) {
                if (IPS[ip].tokens < BUCKET_SIZE) {
                    IPS[ip].tokens = BUCKET_SIZE;
                }
            }
        }, REFILL_DURATION)
    }

    refillTokens()

    removeInactive()

    async function tokenBasedRateLimiter(req, res, next) {
        if (IPS[req.ip] === undefined) {
            IPS[req.ip] = {
                tokens: BUCKET_SIZE,
                lastVisit: new Date()
            }
        }
        console.log(`${req.ip} has ${IPS[req.ip].tokens} tokens`)
        if (IPS[req.ip].tokens <= 0) {
            return res.status(429).end("Too Many Requests")
        }
        IPS[req.ip].tokens--
        IPS[req.ip].lastVisit = new Date()
        next()
    }
    return tokenBasedRateLimiter
}

module.exports = simpleRateLimiter
