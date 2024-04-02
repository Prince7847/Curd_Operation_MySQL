const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
const mysql = require("mysql2");
const connection = require("./Config/db");
const bodyParser = require("body-parser");
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

//ejs uses for read data
app.set("view engine", "ejs")

//middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

//show html file on browser to show form
app.use(express.static(__dirname + "/public"));
//show html file on browser for read data
app.use(express.static(__dirname + "/views"));

app.get("/", (req, res) => {
  res.redirect("./server.js");
});

// Define Swagger options
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Sample API',
      version: '1.0.0',
      description: 'A sample API with Swagger documentation',
    },
    servers:[
      {
        url: 'http://localhost:3000/'
      }
    ]
  },
  apis: ['./server.js'], // Path to your route files
};

const specs = swaggerJsdoc(options);
app.use(express.json());
// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));


//api for user data Update
app.get('/update-read', (req, res) => {
    
    const updateQuery = "select * from data where id=?"

    connection.query(updateQuery, [req.query.id], (error,eachRow)=>{
        if (error) {
            console.log(error)
        } else {
            console.log(eachRow)
            res.render('update.ejs', {eachRow}); 
        }
    })
  });



//api for  Updated user data save in database
app.post("/update-final", (req, res) => {
  
  const id = req.body.hidden_id;
  const name = req.body.name;
  const email = req.body.email;
  const age = req.body.age;
  const mobile = req.body.mobile;
  const work = req.body.work;
  const address = req.body.address;
  const about = req.body.about;

  console.log("id.....", id)

  const updateQuery = "update data set name=? , email=?, age=?, mobile=?, work=?, address=?, about=? where id=?"
  try {

    connection.query(updateQuery, [name, email, age, mobile, work, address, about, id], (error, rows)=>{
        if(error){
          console.log(error);
        }else{
          res.redirect('/read')
        }
    })
    
  } catch (error) {
    console.log(error)
  }
  
});



// Define your DELETE endpoint with Swagger documentation
/**
 * @swagger
 * /delete-read:
 *   get:
 *     summary: Delete a data entry by ID
 *     description: Delete a data entry from the database by its ID
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the data entry to delete
 *     responses:
 *       '200':
 *         description: Successfully deleted the data entry
 *       '400':
 *         description: Bad request, invalid input provided
 *       '500':
 *         description: Internal server error
 */


//api for user data delete
app.get("/delete-read", (req,res)=>{
    const deleteQuery = "delete  from data where id=?"

    connection.query(deleteQuery, [req.query.id], (error,rows)=>{
        if (error) {
            console.log(error)
        } else {
            res.redirect('/read')
        }
    })
})


// Define your GET endpoint with Swagger documentation
/**
 * @swagger
 * /read:
 *   get:
 *       summary: Get all data
 *       description: Retrieve all data from the database
 *       responses:
 *           '200':
 *                 description: Successfully retrieved data
 *           '500':
 *                 description: Internal server error
 */


//api for user data read
app.get('/read', (req,res)=>{
    connection.query("select * from data ", (error,rows)=>{
        if (error) {
            console.log(error)
        } else {
            res.render("read.ejs", {rows})
        }
    })
})


// Define your POST endpoint with Swagger documentation
/**
 * @swagger
 * /create:
 *   post:
 *     summary: Create a new data entry
 *     description: Create a new data entry with provided details
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the entry
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email of the entry
 *               age:
 *                 type: integer
 *                 description: The age of the entry
 *               mobile:
 *                 type: string
 *                 description: The mobile number of the entry
 *               work:
 *                 type: string
 *                 description: The work of the entry
 *               address:
 *                 type: string
 *                 description: The address of the entry
 *               about:
 *                 type: string
 *                 description: Information about the entry
 *     responses:
 *       '200':
 *         description: Successfully created a new data entry
 *       '400':
 *         description: Bad request, invalid input provided
 *       '500':
 *         description: Internal server error
 */


// api for user data create / insert
app.post("/create", (req, res) => {
  console.log(req.body);

  const name = req.body.name;
  const email = req.body.email;
  const age = req.body.age;
  const mobile = req.body.mobile;
  const work = req.body.work;
  const address = req.body.address;
  const about = req.body.about;
  try {
    //write query for create data in database
    connection.query(
      "INSERT INTO `data`(`name`, `email`, `age`, `mobile`, `work`, `address`, `about`) VALUES (?,?,?,?,?,?,?)",
      [name, email, age, mobile, work, address, about],
      (error, rows) => {
        if (error) {
          console.log(error);
        } else {
          res.redirect('/read')
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
