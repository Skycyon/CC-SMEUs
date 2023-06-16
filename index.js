const express = require('express');
const mysql = require('mysql');
const md5 = require('blueimp-md5')
const jwt = require("jsonwebtoken")
const smeData = require('./SmeData');

const app = express();
app.use(express.urlencoded({extended: true}));

const privateKey = "capstone_sme"

// if (0){
//  const city = 'Jakarta';
// }

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
    let sql = 'INSERT INTO t_user values (?,?,?,?, -1, -1, -1, 0)';
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

app.get('/user/:email', async (req, res) => {
  try {
    const email = req.params.email;

    const sql = `SELECT * FROM t_user WHERE email = ?`;
    const params = [email];

    const results = await new Promise((resolve, reject) => {
      connection.query(sql, params, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });

    if (results.length > 0) {
      const user = results[0];
      const userData = {
        email: user.email,
        password:user.password,
        name: user.name,
        phone: user.phone,
        city: user.City,
        generalCategory: user.General_Category,
        priceRange: user.Price_Range,
        rating: user.Rating,
      };
      res.json(userData);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user data: ', error);
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
});

app.put('/user/:email', async (req, res) => {
    try {
      const email = req.params.email;
      const city = req.body.city;
      const generalCategory = req.body.generalCategory;
      const priceRange = req.body.priceRange;
      const rating = req.body.rating;
/*
      if(goods == 0){
        goods = "Casual Fashion"
      }else if(goods == 1){
        goods = "Daily Needs"*/

      if(city==0){
        city=="Bali"
      }else if(city==1){
        city=="Bandung"
      }else if(city==2){
        city=="Jakarta"
      }else if(city==3){
        city=="Surakarta"
      }else if(city==4){
        city=="Yogyakarta"
      }

      if(generalCategory==0){
        generalCategory=="Craft"
      }else if(generalCategory==1){
        generalCategory=="F&B"
      }else if(generalCategory==2){
        generalCategory=="Fashion"
      }else if(generalCategory==3){
        generalCategory=="Munchies"
      }

      if(priceRange==0){
        priceRange=="25.000-50.000"
      }else if(priceRange==1){
        priceRange=="<25.000"
      }else if(priceRange==2){
        priceRange==">50.000"
      }


      const sql = `UPDATE t_user SET City = ?, General_Category = ?, Price_Range = ?, Rating = ? WHERE Email = ?`;
      const params = [city, generalCategory, priceRange, rating, email];
  
      await new Promise((resolve, reject) => {
        connection.query(sql, params, (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
      });
  
      res.json({ message: 'User preferences updated successfully' });
    } catch (error) {
      console.error('Error updating user preferences: ', error);
      res.status(500).json({ error: 'Failed to update user preferences' });
    }
  });
  

  app.get('/sme/predict/:email', async (req,res) => {
    const email = req.params.email;
    
    let goods = req.query.goods
    if(!goods){
      return res.status(400).send({"message":"semua field harus diisi!"})
    }
  
    

    if(goods == 0){
      goods = "Casual Fashion"
    }else if(goods == 1){
      goods = "Daily Needs"
    }else if(goods == 2){
      goods = "Formal Fashion"
    }else if(goods == 3){
      goods = "Household Items"
    }else if(goods == 4){
      goods = "Main Course"
    }else if(goods == 5){
      goods = "Snack"
    }else if(goods == 6){
      goods = "Souvenir"
    }else if(goods == 7){
      goods = "Street Food"
    }else if(goods == 8){
      goods = "Street Snacks"
    }else{
      return res.status(400).send({"message":`goods ${goods} tidak memiliki klasifikasi`})
    }
    try {
      const sql = `SELECT * FROM t_user WHERE email = ?`;
      const params = [email];
      
  
      const results = await new Promise((resolve, reject) => {
        connection.query(sql, params, (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        });
      });
  
      if (results.length > 0) {
        const user = results[0];
        
        
        let city = user.City
        let  generalCategory = user.General_Category
        let priceRange = user.Price_Range
        let  rating = user.Rating
        
        if(city==0){
          city="Bali"
        }else if(city==1){
          city="Bandung"
        }else if(city==2){
          city="Jakarta"
        }else if(city==3){
          city="Surakarta"
        }else if(city==4){
          city="Yogyakarta"
        }
  
        if(generalCategory==0){
          generalCategory="Craft"
        }else if(generalCategory==1){
          generalCategory="F&B"
        }else if(generalCategory==2){
          generalCategory="Fashion"
        }else if(generalCategory==3){
          generalCategory="Munchies"
        }
  
        if(priceRange==0){
          priceRange="25.000-50.000"
        }else if(priceRange==1){
          priceRange="<25.000"
        }else if(priceRange==2){
          priceRange=">50.000"
        }

      const sql1 = `select * from t_sme where goods = ? and city = ? and price_range = ? ORDER BY rating DESC LIMIT 3`;
      const params1 = [goods, city, priceRange];
      const results1 = await new Promise((resolve, reject) => {
        connection.query(sql1, params1, (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        });
      });

      res.status(200).json(results1);
      console.log(results);
      console.log(results1);
      console.log(goods);
      console.log(params1);
    }
    /*res.status(400).json({"message":"email is not registered"})*/
    } catch (error) {
      console.error('Error: ', error);
      res.status(500).json({ error: 'Failed to update user preferences' });
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
       "image":"https://storage.googleapis.com/capstone-smeus/drive-gambar-sme/"+i.Index_Place+'.jpeg'
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
      "image":"https://storage.googleapis.com/capstone-smeus/drive-gambar-sme/"+results[0].Index_Place+'.jpeg'
    }
    res.status(200).json(result_fin);
  } catch (error) {
    console.error('Error fetching SME: ', error);
    res.status(400).json({ error: 'Failed to fetch SME' });
  }
})

app.get('/similarity', async (req, res) => {
  try {
    const sme1 = req.query.sme;
    const limit = req.query.limit;

    // Find the row corresponding to restaurant1 in the dataset
    const smeRow = smeData.find((row) => row.Name_SMEs === sme1);

    if (!smeRow) {
      return res.status(404).json({ error: 'SME not found.' });
    }

    // Sort the similarity values in descending order
    const sortedSimilarities = Object.entries(smeRow)
      .filter(([key]) => key !== 'Name_SMEs' && key !== sme1) // Exclude the 'Name_SMEs' field and queried restaurant
      .sort((a, b) => b[1] - a[1]);

    // Get the top 3 similar restaurants
    const Similar = sortedSimilarities.slice(0, limit).map(([sme]) => sme);

    let sql = `select * from t_sme where`
    let ctr = 0
    Similar.forEach(i => {
      if(ctr == 0){
        sql += ` name_smes = '${i}'`
      }else{
        sql += ` or name_smes ='${i}'`
      }
      ctr +=1
    });
    sql += ";"
    const params = []
    const results = await new Promise((resolve, reject) => {
      connection.query(sql, params, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });

    const result_fin = []
    let temp = {}
    // console.log(result1)
    // console.log(result1[0])

    results.forEach(i => {
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
       "image":"https://storage.googleapis.com/capstone-smeus/drive-gambar-sme/"+i.Index_Place+'.jpeg'
       }
       result_fin.push(temp)
     });
    res.status(200).json({ result_fin });
  } catch (error) {
    console.error('Error fetching SMEs: ', error);
    res.status(400).json({ error: 'Failed to fetch SMEs' });
  }
});

const get_query_by_sme = "select count(u.name) as 'total' from wishlist w inner join t_user u on u.email = w.email where w.index_place = ? and bookmark = 1"
const get_query_by_user = "select index_place from wishlist where email = ? and bookmark = 1"
const post_query = "insert into wishlist values(1, ?, ?)"
const update_query = "update wishlist set bookmark = ? where index_place = ? and email = ?"

// GET wishlist count by SME index
app.get('/sme/:id/wishlist', async (req, res) => {
  try {
    const index = [req.params.id];
    const count = await new Promise((resolve, reject) => {
      connection.query(get_query_by_sme, index, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
    const total = count[0].total
    res.status(200).json({ total });
  } catch (error) {
    console.error('Error fetching SME: ', error);
    res.status(400).json({ error: 'Failed to fetch SME' });
  }
});

// GET wishlist by user email
app.get('/user/:email/wishlist', async (req, res) => {
    try {
    const email = [req.params.email];
    const result = await new Promise((resolve, reject) => {
      connection.query(get_query_by_user, email, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
    const id = [];
    let sql = 'SELECT * FROM t_sme WHERE index_place = ?';
    let ctr = 0
    result.forEach(i => {
      id.push(i.index_place)
      ctr++
      if(ctr < result.length){
        sql += " or index_place = ?"
      }
      console.log(ctr)
    });

    //limit top 3?
    console.log(id)
    const result1 = await new Promise((resolve, reject) => {
      connection.query(sql, id, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
    const results = Object.values(JSON.parse(JSON.stringify(result1)));
    const result_fin = []
    let temp = {}

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
       "image":"https://storage.googleapis.com/capstone-smeus/drive-gambar-sme/"+i.Index_Place+'.jpeg'
       }
       result_fin.push(temp)
     });

    return res.status(200).json({ result_fin });
  } catch (error) {
    console.error('Error fetching SME: ', error);
    return res.status(400).json({ error: 'Failed to fetch SME' });
  }
});

// POST wishlist
app.post('/wishlist', async (req, res) => {
  try {
    const email = req.body.email;
    const index = req.body.index;
    const params = [email, index]

    const result = await new Promise((resolve, reject) => {
      connection.query(post_query, params, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
    res.status(200).json({ "message":"Insert success" });
  } catch (error) {
    console.error('Error fetching SME: ', error);
    res.status(400).json({ error: 'Failed to fetch SME' });
  }

  res.json({ message: 'Wishlist added successfully' });
});

app.put(`/wishlist`, async (req, res) => {
  try {
    const email = req.body.email;
    const index = req.body.index;
    const params = [email, index]

    const result1 = await new Promise((resolve, reject) => {
      connection.query(`select bookmark from wishlist where email = ? and index_place = ?`, params, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });

    let params1 = []
    let messAdded = ""
    let isWishlisted = 0
    let result
    if(result1.length <= 0){

      result = await new Promise((resolve, reject) => {
        connection.query(post_query, params, (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        });
      });
      return res.status(200).json({"message":`Wishlist added`})
    }else{
      isWishlisted = result1[0].bookmark
    }
    console.log(isWishlisted)
    if(isWishlisted == 1){
      params1.push(0)
      messAdded += "removed"
    }else{
      params1.push(1)
      messAdded += "added"
    }
    // start from here
    params1.push(index)
    params1.push(email)
    result = await new Promise((resolve, reject) => {
      connection.query(update_query, params1, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
    console.log(params1)
    return res.status(200).json({"message":`Wishlist ${messAdded}`})
  }catch(error){
    console.error('Error fetching SME: ', error);
    res.status(400).json({ error: 'Failed to fetch SME' });
  }
})

const port=8080;
app.listen(port, function(){
    console.log(`listening on port ${port}`)
})
