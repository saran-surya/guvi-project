const Pool = require('pg').Pool

// -------Global Pool---------

const pool = new Pool({
  connectionString : process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
})
pool.connect()

// ------ local pool -------

// const pool = new Pool({
//   user: 'postgres',
//   host: 'localhost',
//   database: 'guvi',
//   password: 'demo@123',
//   port: 5432,
// })

const createUser = (request, response) => {
    try {
        // console.log(request)
        const { name, email, password} = request.query
        pool.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *', [name, email, password], (error, result) => {
        if (error) {
            throw Error
        }
        console.log("success")
        response.status(201).json({
          success : true,
          message : "user added",
          id: result.rows[0].id
        })
    })
    } catch (error) {
        console.log(error.message)
        response.status(400).json({
          success : false,
          message : "server error"
        })
    }
  }

module.exports = {
    createUser : createUser
}