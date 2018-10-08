var exports = module.exports = {};

var Admin = {
   facultyCreate: (client,facultyData,callback) => {
      var facultyData = [
      facultyData.firstName,
      facultyData.lastName, 
      facultyData.email, 
      facultyData.userType, 
      facultyData.password
      ];
      const query =  `
       INSERT INTO users (first_name,last_name,email,user_type,password) 
       VALUES ($1,$2,$3,$4,$5)
      `;
      client.query(query,facultyData)
      .then(res => callback('SUCCESS'))
      .catch(e => callback('ERROR'))
    },
  getByEmail: (client,email,callback) => {
      const query =  `
          select * from users where email = '${email}'
      `;
      client.query(query,(req,result)=>{
        callback(result.rows[0])
      });
    },
  getById: (client,id,callback) => {
      const query =  `
          select * from users where id = '${id}'
      `;
      client.query(query,(req,result)=>{
        callback(result.rows[0]);
      });
    },
      facultyList: (client, filter, callback) => {
    const query = `SELECT * FROM users where user_type='faculty'`;
    client.query(query, (req, result) =>{
      callback(result.rows);
    });
  },
  adviserList: (client, filter, callback) => {
    const query = `SELECT * FROM users where user_type='faculty'`;
    client.query(query, (req, result) =>{
      callback(result.rows);
    });
  }
  }


module.exports = Admin;