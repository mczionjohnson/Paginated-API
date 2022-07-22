# req options
req.query
req.params
req.body


# slice()

users.slice()

# parseInt()
parse the string to int

# saving in a res
     results.results = model.slice(startIndex, endIndex);
        res.paginatedResult = results;
        next()

        <!-- saved the result in res to be used later and called next() -->

# curl -v 
--verbose mode to show response headers

# curl query and format JSON result
curl -v "http://localhost:3000/users?page=2&limit=3" | json_pp