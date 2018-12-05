const mongoose = require('mongoose')
const env = require('../env')

mongoose.Promise = Promise
// mongoose.set('debug', true)

mongoose.connect(env.MONGO_SERVER)
.then(() => console.log('==>'.green, 'MongoDB has started'.magenta))
.catch(err => {
    console.error(err.message)
    process.exit(1)
});
