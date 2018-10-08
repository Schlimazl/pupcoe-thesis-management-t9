var exports = module.exports = {};

var Student = {
   studentCreate: (client,studentData,callback) => {
      var studentData = [
      studentData.firstName,
      studentData.lastName, 
      studentData.studentNumber,
      studentData.email, 
      studentData.userType, 
      studentData.password
      ];
      const query =  `
       INSERT INTO users (first_name,last_name,student_number,email,user_type,password) 
       VALUES ($1,$2,$3,$4,$5,$6)
      `;
      client.query(query,studentData)
      .then(res => callback('SUCCESS'))
      .catch(e => callback('ERROR'))
    },
   classCreate: (client,classData,callback) => {
      var classData = [
      classData.batch,
      classData.section, 
      classData.adviser_id
      ];
      const query =  `
       INSERT INTO classes (batch,section,adviser_id)
       VALUES ($1,$2,$3)
      `;
      client.query(query,classData)
      .then(res => callback('SUCCESS'))
      .catch(e => callback('ERROR'))
    },
    studentList: (client, filter, callback) => {
    const query = `SELECT * FROM users where user_type='student'`;
    client.query(query, (req, result) =>{
      callback(result.rows);
    });
  },
      classList: (client, filter, callback) => {
    const query = `SELECT classes.id, classes.batch, classes.section, users.email
FROM classes
INNER JOIN users on classes.adviser_id = users.id`;
    client.query(query, (req, result) =>{
      callback(result.rows);
    });
  }
  }


module.exports = Student;