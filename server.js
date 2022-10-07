const express = require('express');
const app = express();
const port = 3000;
app.use(express.json());
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');

const { check, validationResult } = require('express-validator');
const mariadb = require('mariadb');
const pool = mariadb.createPool({
	host:'localhost',
	user:'root',
	password:'root',
	database:'sample',
	port: 3306,
	connectionLimit:5
});

const options = {
	swaggerDefinition: {
	  info: {
		title: 'API',
		description:'Sample DB CRUD Operations API',
		version: '1.0.0',
	  },
	  host: '142.93.253.177:3000',
	  basePath:'/'
	},
	apis: ['./server.js'], // files containing annotations as above
  };
  
const specs = swaggerJsDoc(options);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use(cors());

app.get('/', (req,res) => {
	res.status(200).send('Welcome to API CRUD.')
});

/**
 * @swagger
 * /students:
 *   get:
 *     description: Return all students
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Object that contains array of students
 */
app.get('/students',async (req, res)=> {
let connection;
try{
	connection = await pool.getConnection();
	const sql = 'SELECT * FROM student';
	const data = await connection.query(sql);
	res.status(200).json(data);
} catch(err) {
	res.status(400).send(err.message);
} finally{
	if(connection){
		return connection.release();
	}
}
});


/**
 * @swagger
 * /foods:
 *   get:
 *     description: Return all foods
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Object that contains array of foods
 */
app.get('/foods',async (req, res)=> {
let connection;
try{
		connection = await pool.getConnection();
        const sql = 'SELECT * FROM foods';
        const data = await connection.query(sql);
        res.status(200).json(data);
} catch(err) {
        res.status(400).send(err.message);
} finally{
	if(connection){
		return connection.release();
	}
}
});

/**
 * @swagger
 * /orders:
 *   get:
 *     description: Return all orders
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Object that contains array of orders
 */
app.get('/orders',async (req, res)=> {
let connection;
try{
		connection = await pool.getConnection();
        const sql = 'SELECT * FROM orders';
        const data = await connection.query(sql);
        res.status(200).json(data);
} catch(err) {
        res.status(400).send(err.message);
} finally {
	if(connection) {
		return connection.release();
	}
}
});

/**
* @swagger
* /foods:
*   post:
*     summary: Creates a food item
*     consumes: application/json
*     parameters:
*       - in: body
*         name: body
*         schema:
*           type: object
*           properties:
*             ITEM_ID:
*                 type: string
*             ITEM_NAME:
*                 type: string
*             ITEM_UNIT:
*                 type: string
*             COMPANY_ID:
*                 type: string
*     responses:
*       201:
*         description: Created
*       400:
*         description: Bad Request
*       500:
*         description: Internal Server Error
*/
app.post('/foods',[check('ITEM_ID').not().isEmpty().trim(), check('ITEM_NAME').not().isEmpty().trim(), check('ITEM_UNIT').not().isEmpty().trim(), check('COMPANY_ID').not().isEmpty().trim()], async (req,res) => {
	let connection; 
	const errors = validationResult(req);
	if(!errors.isEmpty()){
		return res.status(400).json({errors: errors.array()});
	}
	else{
		try {
			connection = await pool.getConnection();
			var itemID = req.body.ITEM_ID;
			var itemName = req.body.ITEM_NAME;
			var itemUnit = req.body.ITEM_UNIT;
			var companyID = req.body.COMPANY_ID;

			var sql = `INSERT INTO foods (ITEM_ID, ITEM_NAME, ITEM_UNIT, COMPANY_ID) VALUES ('${itemID}', '${itemName}', '${itemUnit}','${companyID}')`;
			var rows = await connection.query(sql);
			res.status(201).json(req.body)
		}
		catch(err){
			res.status(400).send(err.message);
		} finally{
			if(connection){
				return connection.release();
			}
		}
	}
});

/**
* @swagger
* /foods:
*   put:
*     summary: Updates a food item using ITEM_ID
*     consumes: application/json
*     parameters:
*       - in: body
*         name: body
*         schema:
*           type: object
*           properties:
*             ITEM_ID:
*                 type: string
*             ITEM_NAME:
*                 type: string
*             ITEM_UNIT:
*                 type: string
*             COMPANY_ID:
*                 type: string
*     responses:
*       204:
*         description: Data updated Successfully
*       400:
*         description: Bad Request
*       500:
*         description: Internal Server Error
*/
app.put('/foods',[check('ITEM_ID').not().isEmpty().trim(), check('ITEM_NAME').not().isEmpty().trim(), check('ITEM_UNIT').not().isEmpty().trim(), check('COMPANY_ID').not().isEmpty().trim()], async (req,res) => {
	let connection; 
	const errors = validationResult(req);
	if(!errors.isEmpty()){
		return res.status(400).json({errors: errors.array()});
	}
	else{
		try {
			connection = await pool.getConnection();
			var itemID = req.body.ITEM_ID;
			var itemName = req.body.ITEM_NAME;
			var itemUnit = req.body.ITEM_UNIT;
			var companyID = req.body.COMPANY_ID;

			var sql = `UPDATE foods SET ITEM_NAME = '${itemName}',ITEM_UNIT='${itemUnit}',COMPANY_ID='${companyID}' WHERE ITEM_ID='${itemID}'`;
			var rows = await connection.query(sql);
			res.status(204).json('Item Updated Sucessfully')
		}
		catch(err){
			res.status(400).send(err.message);
		} finally{
			if(connection){
				return connection.release();
			}
		}
	}
});

/**
* @swagger
* /foods:
*   patch:
*     summary: Updates ITEM_UNIT using ITEM_ID
*     consumes: application/json
*     parameters:
*       - in: body
*         name: body
*         schema:
*           type: object
*           properties:
*             ITEM_ID:
*                 type: string
*             ITEM_UNIT:
*                 type: string
*     responses:
*       200:
*         description: ITEM_UNIT updated Successfully
*       400:
*         description: Bad Request
*       500:
*         description: Internal Server Error
*/
app.patch('/foods',[check('ITEM_ID').not().isEmpty().trim(), check('ITEM_UNIT').not().isEmpty().trim()], async (req,res) => {
	let connection; 
	const errors = validationResult(req);
	if(!errors.isEmpty()){
		return res.status(400).json({errors: errors.array()});
	}
	else{
		try {
			connection = await pool.getConnection();
			var itemID = req.body.ITEM_ID;
			var itemUnit = req.body.ITEM_UNIT;

			var sql = `UPDATE foods SET ITEM_UNIT='${itemUnit}' WHERE ITEM_ID='${itemID}'`;
			var rows = await connection.query(sql);
			res.status(200).json('Item Updated Sucessfully')
		}
		catch(err){
			res.status(400).send(err.message);
		} finally{
			if(connection){
				return connection.release();
			}
		}
	}
});

/**
* @swagger
* /foods/{itemID}:
*   delete:
*     summary: Deletes a food item
*     parameters:
*       - in: path
*         name: itemID
*         required: true
*         description: ITEM_ID to delete
*         schema:
*           type:string
*     responses:
*       200:
*         description: ITEM deleted Successfully
*       400:
*         description: Bad Request
*       500:
*         description: Internal Server Error
*       404:
*         description: Item not found
*/
app.delete('/foods/:itemID', async (req,res) => {
	let connection; 
	const errors = validationResult(req);
	if(!errors.isEmpty()){
		return res.status(400).json({errors: errors.array()});
	}
	else{
		try {
			connection = await pool.getConnection();
			var itemID = req.params.itemID;

			var sql = `DELETE FROM foods WHERE ITEM_ID='${itemID}'`;
			var rows = await connection.query(sql);
			if(rows.affectedRows){

			res.status(200).json('Item deleted Sucessfully');
			}
			else{
				res.status(404).json('Item not found');
			}
		}
		catch(err){
			res.status(400).send(err.message);
		} finally{
			if(connection){
				return connection.release();
			}
		}
	}
}); 

app.get('/say', (req,res) => {
	let keyword = req.query.keyword;
	axios.get('https://faas-nyc1-2ef2e6cc.doserverless.co/api/v1/web/fn-9583469b-49f1-47c2-baf2-fc05d6bff410/default/say-python?keyword='+keyword)
	.then(response => {
		res.status(200).send(response.data);
	})
	.catch(errors => {
		console.log(errors)
	});
});

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`)
})
