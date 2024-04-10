import express from "express"

const router = express.Router()

router.get('/:p1?/:p2?', (req, res) => {
    res.json({
        url: req.url, // looks it up from the router
        baseUrl: req.baseUrl, // before entering the router
        originalUrl: req.originalUrl, // the whole url 
        p1: req.params.p1,
        p2: req.params.p2,
        //null shows up on json but not undefined 
    })
})

export default router