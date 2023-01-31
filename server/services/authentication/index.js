import bcrypt from "bcrypt";
import generateJwt from "../../routes/common/tokenGenerator.js";
import pool from "../../db/config.js"
import { sendEmail } from "../common/email.js";
import moment from 'moment'

//Send OTP Function
export const sendOtp = async (req) => {
  if (!req.body.emp_email) {
    throw "Email is required"
  }

  let emp_email = req.body.emp_email.toLowerCase();
  let users = await pool.query('SELECT * FROM employee_master where lower(emp_email)= $1', [emp_email])
  let user = users.rows[0];
  if (!user) {
    throw "User is not registered"
  }

  // Generate Random OTP
  let otp = Math.floor(100000 + Math.random() * 900000);
  await pool.query(`delete from otp where lower(emp_email) = $1`, [emp_email]);
  await pool.query(`insert into otp (emp_email,otp) values ($1, $2)`, [emp_email, otp]);
  await sendEmail(emp_email, 'OTP for Eagle100 Portal', `Your OTP is ${otp}`);
  console.log('otp',otp)
  return { message: "OTP has been sent to your registered Email." };

};

// verify OTP
export const verifyOtp = async (req) => {
  try{
   if (!req.body.emp_email || !req.body.otp) {
      throw "Email/Password or OTP is missing"
    }
  
    let user_email = req.body.emp_email.toLowerCase();
    let user_otp = req.body.otp;
  
    let users1 = await pool.query(`SELECT * FROM employee_master where lower(emp_email)= $1`, [user_email])
    let user1 = users1.rows[0];
    if (!user1) {
      throw "Email is not registered"
    }
    

    let users2 = await pool.query(`SELECT * FROM vw_otp where lower(emp_email)= $1 and otp= $2 and time_lapsed_min<=60`, [user_email, user_otp])
    let user2 = users2.rows[0];
    if (!user2) {
      
      try{
        throw "OTP is expired or Invalid"
      }
      catch(err){console.log(err)}
    }
    else {
      let emp = await pool.query(`update employee_master set last_login = $1 where lower(emp_email) =$2`, [moment(),user_email]);
    }
  
    return {
      accessToken: generateJwt({
        id: user1.emp_id,
        email: user1.emp_email,
        first_name: user1.emp_first_name,
        last_name: user1.emp_last_name,
        emp_type: user1.emp_type
      }),
    };
  }
  catch(err){console.log(err)}
};

//verify user
export const verifyUser = async (req) => {
  let emp_email = req.body.emp_email.toLowerCase();
  let emp_first_name = req.body.emp_first_name;
  let emp_last_name = req.body.emp_last_name;

  let users1 = await pool.query('SELECT * FROM employee_master where lower(emp_email)= $1', [emp_email])
  let user1 = users1.rows[0];

  if (!user1) {
    let emp = await pool.query(`insert into employee_master(emp_email,emp_designation,emp_first_name,emp_last_name,emp_phone,last_login) values ($1, $2, $3, $4, $5, $6) returning emp_id`,
      [
        emp_email,
        req.body.emp_designation ? req.body.emp_designation : 'consultant',
        emp_first_name,
        emp_last_name,
        req.body.emp_phone ? req.body.emp_phone : '',
        moment(),
      ]);

    return {
      accessToken: generateJwt({
        id: emp.rows[0].emp_id,
        email: emp_email,
        first_name: emp_first_name,
        last_name: emp_last_name,
        emp_type: 1,
      }),
    };
  } else {
    let emp = await pool.query(`update employee_master set last_login = $1,emp_designation=$2,emp_first_name=$3,emp_last_name=$4,emp_phone=$5 where lower(emp_email) =$6`, [moment(),
    req.body.emp_designation ? req.body.emp_designation : 'consultant',
    emp_first_name,
    emp_last_name,
    req.body.emp_phone ? req.body.emp_phone : '', 
    emp_email]);
    return {
      accessToken: generateJwt({
        id: user1.emp_id,
        email: user1.emp_email,
        first_name: user1.emp_first_name,
        last_name: user1.emp_last_name,
        emp_type: user1.emp_type
      }),
    };
  }
};
export const login = async (req) => {
  try{
    const emp_email = req.body.emp_email;
    const password = req.body.password.toString();
    let users1 = await pool.query('SELECT * FROM employee_master where lower(emp_email)= $1', [emp_email])
    let users2 = await pool.query('SELECT * FROM  sys_users where lower(sys_username)= $1', [emp_email])
    const user1 = users1.rows[0];
    const user2 = users2.rows[0];

      if(!user1){

        if(!user2){

          throw "Invalid Email Id"
        }

      } else{

        if(bcrypt.compareSync(password,user2.sys_userpassword)){
          let result = await pool.query(`update employee_master set last_login = $1`,[moment()]);

          return {
            accessToken: generateJwt({
            id: user1.emp_id,
            email: user1.emp_email,
            first_name: user1.emp_first_name,
            last_name: user1.emp_last_name,
            emp_type: user1.emp_type,
            sys_userid: user2.sys_userid
            }),
          };
        }
      }
  }catch(error){
    console.log(error);
  }
  };


  
export const createUser = async (req) => {
  try {
    let emp_email = req.body.emp_email.toLowerCase();
    let emp_first_name = req.body.emp_first_name;
    let emp_last_name = req.body.emp_last_name;
    let password = req.body.password;
    let emp_type = req.body.emp_type ? req.body.emp_type : 1;
    let emp_designation = req.body.emp_designation ? req.body.emp_designation : 'consultant'

    const passwordHash = await bcrypt.hash(password, 10);

    let users1 = await pool.query('SELECT emp_id,emp_email,emp_first_name,emp_last_name,emp_type,sys_userid FROM employee_master where lower(emp_email)= $1', [emp_email])
    let users2 = await pool.query('SELECT * FROM  sys_users where lower(sys_username)= $1', [emp_email])
    let user1 = users1.rows[0];
    let user2 = users2.rows[0];
    if(!user2 ){
      const sys_result = await pool.query('INSERT INto public.sys_users(sys_username,sys_userpassword,sys_usertype) VALUES ($1,$2,$3)',[emp_email,passwordHash, req.body.sys_usertype ? req.body.sys_usertype : 'consultant',])
    if(!user1){
      const result = await pool.query(`INSERT INTO public.employee_master (emp_email, emp_first_name,emp_last_name,emp_type,emp_designation,last_login,sys_userid) 
      VALUES($1,$2,$3,$4,$5,$6,(SELECT s.sys_userid FROM sys_users s LEFT JOIN employee_master e on e.sys_userid=s.sys_userid WHERE e.sys_userid IS NULL)) RETURNING emp_id`, [emp_email, emp_first_name,emp_last_name, emp_type, emp_designation,moment()]);
      return {
        accessToken: generateJwt({
          id: result.rows[0].emp_id,
          email: emp_email,
          first_name: emp_first_name,
          last_name:emp_last_name,
          emp_type: emp_type,
          //id: sys_result.rows[0].sys_userid
        }),
      };
    }
    
  }
  else{
    let result = await pool.query(`update employee_master set last_login = $1,emp_designation=$2,emp_first_name=$3,emp_last_name=$4,emp_phone=$5 where lower(emp_email) =$6`, [moment(),
      req.body.emp_designation ? req.body.emp_designation : 'consultant',
      emp_first_name,
      emp_last_name,
      req.body.emp_phone ? req.body.emp_phone : '', 
      emp_email]);
      return {
        accessToken: generateJwt({
          email: user1.emp_email,
          first_name: user1.emp_first_name,
          last_name: user1.emp_last_name,
          emp_type: user1.emp_type,
          sys_userid: user2.sys_userid
        }),
      };
  }
   
  } 
  catch (error) {
    console.log(error);
  }
}

export const forgotPassword = async (req)  => {
  try{
  let emp_email = req.body.emp_email

  let user1 = await pool.query('Select * from sys_users where lower(sys_username) = $1', [emp_email])
  let user2 = await pool.query('Select * from employee_master where lower(emp_email)= $1',[emp_email])

  const _id =user2.emp_id;

  let users1 = user1.rows[0];
  let users2 = user2.rows[0];

  const password_reset = Math.floor(100000 + Math.random() * 9000);
  const hash = await bcrypt.hash(password_reset.toString(), 10);

  console.log(users2)
    if(!users1 && !users2){
       " User is not registered "
  }
  else{
    const link = `${process.env.BASE_URL}/password-reset?_id=${_id}/${hash}`
    let result = await sendEmail(emp_email, 'Password Reset', link);
  }
  return { message: "Invite has been sent successfully" };
  }
  catch (error){
    console.log(error);
  }

}
export const passwordReset = async (req) => {
try{
  const emp_id = req.body._id;
  let password = req.body.password
  const passwordHash = await bcrypt.hash(password, 10);

  let user1 = await pool.query('select emp_id from employee_master where emp_id =$1',[emp_id])
  if(!user1){
    return "invalid link or link expired"
  }
  else {
    let result = await pool.query(`update sys_users set sys_userpassword = $1`,[passwordHash]);

    return "You have successfully changed the password please login"
  }

}
catch(error){
  console.log(error);
}
}