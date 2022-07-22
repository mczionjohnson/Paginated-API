const router = require('express').Router()
const User = require('./model')


router.get('/', (req, res) => {
    // res.setHeader()
    res.status(200).json('Welcome')
})

// test
// router.get('/users', (req, res) => {
//     // res.json('Welcome Users')
//     res.json(User.length)

// })

router.get('/users', paginedResult(User), (req, res) => {
 
    res.send(res.paginatedResult);
})

router.get('/users/:id', async (req, res) => {
    let user
    try {
        user = await User.findById(req.params.id) 
        
        res.status(200).send(user)  

    } catch (err) {
        res.status(500).send(err.message)
        console.log(err)
    }

} )

router.post('/users/:id', async (req, res) => {
    let user
    try {
        user = await User.findById(req.params.id)
        // const test = req.body
        user.name = req.body.name

        await user.save()
        
        res.status(200).json(`name changed to ${user.name} successfully`)  

    } catch (err) {
        res.status(500).send(err.message)
        console.log(err)
    }

} )

// this middlware needs req, res and next
function paginedResult(model) {
    return async (req, res, next) => {
        const checkSize =  await model.countDocuments().exec()
           // to check for empty collections in Db
           if (checkSize == 0) {
            return res.status(404).json({error: 'Not Found'})
        }

        const page = parseInt(req.query.page)
        // const limit =  parseInt(req.query.limit)
        
        // handling limit 
        let limit
        if (!req.query.limit) {
              limit = checkSize
            //   limit = await model.countDocuments().exec()
        } else {
            //  limit =  parseInt(req.query.limit)
             limit =  (parseInt(req.query.limit) > checkSize) ? checkSize : parseInt(req.query.limit)
            //  even when req.query.limit is too much
        }

        // let newCheckSize = (checkSize % 2 != 0) ? (checkSize + 1) : checkSize
        // if (checkSize % 2 != 0) {
        //     newCheckSize = (checkSize + 1)
        // }
        const checkPageSize = (checkSize / limit)
        const parsedResult = (checkSize % limit != 0) ? (await parseInt(checkPageSize) + 1) : checkPageSize

        // to check for empty collections in Db
        // if (checkSize == 0) {
        //     return res.status(404).json({error: 'Not Found'})
        // }

        // to restrict possible pages
        if (page > parsedResult) {
            // return res.status(404).json({limit, page})
            return res.status(404).json({error: 'Not Found'})
        }        
        
        // to restrict possible limit
        // if (limit > parsedResult) {
        //     return res.status(404).json({error: 'Not Found'})
        // }
    
        const startIndex = (page - 1) * limit
        // page is 1 - 1 * limit = 0
        const endIndex = page * limit
        // end will be set page (eg. 1) * set limit 
        
        const results = {} 
    
        if (endIndex < checkSize) {
            // if (endIndex < await model.countDocuments().exec()) {
            results.next = {
                page: page + 1,
                limit: limit
            }        
        }
     
    
        if (startIndex > 0) {
            results.previous = {
                page: page - 1,
                limit: limit
            }
        }
        
            
        results.totalPages = parsedResult
        results.totalUser = checkSize
    
        // results.results = model.slice(startIndex, endIndex);
        // it will only work without database 

        // proper query with a dababase
        // find all users and limit the array returned
        try {
            results.results = await model.find().limit(limit).skip(startIndex).exec()

        res.paginatedResult = results;
        next()
        } catch (err) {
            console.log(err)
        }
    }
}

module.exports = router;