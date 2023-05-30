const express = require('express');
const mysql = require('mysql');
const md5 = require('blueimp-md5')
const jwt = require("jsonwebtoken")


const app = express();
app.use(express.urlencoded({extended: true}));

const privateKey = "capstone_sme"

const connection = mysql.createConnection({
  host: '34.101.85.105',
  user: 'root',
  password: 'smeus-capstone',
  database: 'capstone-db',
});

connection.connect((error) => {
  if (error) {
    console.error('Error connecting to the database: ', error);
  } else {
    console.log('Connected to the database');
  }
});

app.post('/register', async (req, res) =>{
  try {
    const email = req.body.email
    const password = req.body.password
    const name = req.body.name
    const phone = req.body.phone

    if(!email || !password || !name || !phone){
      return res.status(400).send({"message":"Semua field harus diisi!"})
    }
    const params1 = [email]
    const sql1 = "select * from t_user where email = ?"
    const results1 = await new Promise((resolve, reject) => {
      connection.query(sql1, params1, (error, results1) => {
        if (error) {
          reject(error);
        } else {
          resolve(results1);
        }
      });
    });
    if(results1.length > 0){
      return res.status(200).send({"message":"email sudah terdaftar!"})
    }

    const params = [email, md5(password), name, phone]
    let sql = 'INSERT INTO t_user values (?,?,?,?)';
    const results = await new Promise((resolve, reject) => {
      connection.query(sql, params, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
    return res.status(201).send({
      "message":"berhasil register!"
    })
  }catch (error){
    console.error('Error Register: ', error);
    res.status(400).json({ error: 'Failed to Register' });
  }
})

app.post('/login', async (req, res) =>{
  try {
    const email = req.body.email
    const password = req.body.password
    if(!email || !password){
      return res.status(400).send({"message":"Semua field harus diisi!"})
    }
    const params = [email, md5(password)]
    let sql = 'SELECT * FROM t_user WHERE email = ? AND password = ?';
    const results = await new Promise((resolve, reject) => {
      connection.query(sql, params, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
    if(results.length < 1){
        return res.status(400).send({"message":"Password tidak sesuai!"})
    }
    const token = jwt.sign(
        {"email":results[0].email, "name":results[0].name, "phone":results[0].phone},
        privateKey
    )
    return res.status(201).send({
      "message":"berhasil login!",
      "token":token
    })
  }catch (error){
    console.error('Error fetching SMEs: ', error);
    res.status(400).json({ error: 'Failed to Login' });
  }
})

app.post('/check', async (req, res) =>{
  const token = req.headers["x-auth-token"]
    if(!token){
        return res.status(401).send({"message":"token tidak ditemukan!"})
    }
    try {
        const user = jwt.verify(token,privateKey)
        console.log(user.name)
        return res.status(200).send({"message":"success","name":user.name, "phone":user.phone})
    } catch (ex) {
        console.log(ex)
        return res.status(403).send({"message":ex})
    }
})

//Get SMEs with City, Price_Range, General_Category
app.get('/sme', async (req, res) => {
  try {
    const city = req.query.city
    const price_range = req.query.price_range
    const general_category = req.query.general_category
    const limit = req.query.limit

    let sql = 'SELECT * FROM t_sme WHERE 1=1';
    const params = [];

    if (city) {
      sql += ' AND City = ?';
      params.push(city);
    }

    if (price_range) {
      sql += ' AND Price_Range = ?';
      params.push(price_range);
    }

    if (general_category) {
      sql += ' AND General_Category = ?';
      params.push(general_category);
    }
    //limit top 3?
    sql += ' ORDER BY RATING DESC';
    if(limit){sql +=` LIMIT ${parseInt(limit)}`}else{sql+=' LIMIT 3'}
    console.log(sql)
    const results = await new Promise((resolve, reject) => {
      connection.query(sql, params, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
    let result1 = Object.values(JSON.parse(JSON.stringify(results)));

    const result_fin = []
    let temp = {}
    // console.log(result1)
    // console.log(result1[0])

    result1.forEach(i => {
      temp = {
       "index_place":i.Index_Place,
       "city":i.City,
       "name_smes":i.Name_SMEs,
       "general_category":i.General_Category,
       "specialty":i.Specialty,
       "price_range":i.Price_Range,
       "rating":i.Rating,
       "goods":i.Goods,
       "description":i.Description,
       "contact":i.Contact,
       "image":"https://storage.googleapis.com/capstone-smeus/drive-gambar-sme/"+i.Index_Place+'.jpg'
       }
       result_fin.push(temp)
     });
    res.status(200).json(result_fin);
  } catch (error) {
    console.error('Error fetching SMEs: ', error);
    res.status(400).json({ error: 'Failed to fetch SMEs' });
  }
});

//Get SMEs with City, Price_Range, General_Category
app.get('/sme/:id', async (req, res) => {
  try {
    const id = [req.params.id];

    let sql = 'SELECT * FROM t_sme WHERE index_place = ?';

    //limit top 3?

    const result = await new Promise((resolve, reject) => {
      connection.query(sql, id, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
    const results = Object.values(JSON.parse(JSON.stringify(result)));
    const result_fin = {
      "index_place":results[0].Index_Place,
      "city":results[0].City,
      "name_smes":results[0].Name_SMEs,
      "general_category":results[0].General_Category,
      "specialty":results[0].Specialty,
      "price_range":results[0].Price_Range,
      "rating":results[0].Rating,
      "goods":results[0].Goods,
      "description":results[0].Description,
      "contact":results[0].Contact,
      "image":"https://storage.googleapis.com/capstone-smeus/drive-gambar-sme/"+results[0].Index_Place+'.jpg'
    }
    res.status(200).json(result_fin);
  } catch (error) {
    console.error('Error fetching SME: ', error);
    res.status(400).json({ error: 'Failed to fetch SME' });
  }
})

const port=8080;
app.listen(port, function(){
    console.log(`listening on port ${port}`)
})