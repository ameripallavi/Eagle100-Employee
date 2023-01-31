'use strict';

import bcrypt from "bcrypt";
import dbPool from "../../db/config.js"


//const getEmpList = async (payload) => {
//  try {
// const { first_name, last_name, email_id, sys_userid } = payload;
// const result = await dbPool.query('SELECT * FROM public.employee_master;');
// return result?.rows || [];
// } catch (error) {
//return Promise.reject(error);
//  }
//}


const createUser = async (payload) => {
  try {
    const { user_name, password, user_type, user_status } = payload;

    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash, 'user_name')
    const result = await dbPool.query('INSERT INTO public.user_master (user_name, password, user_type, user_status) VALUES ($1, $2, $3, $4)', [user_name, passwordHash, user_type, user_status]);
    return result?.rows?.[0];
  } catch (error) {
    return Promise.reject(error);
  }
}
//const deleteEmp = async (payload) => {
//try {
//  const { first_name, last_name, email_id, sys_userid } = payload;
//  const result = await dbPool.query('DELETE from  public.employee_master where emp_id = $1',[id]);
//  return result?.rows?.[0];
//} catch (error) {
//  return Promise.reject(error);
// }
//}

//const updateEmp = async (payload) => {
//   try {
// const { first_name, last_name, email_id, sys_userid } = payload;
//  const result = await dbPool.query('UPDATE   public.employee_master SET first_name=$1,last_name=$2,email_id=$3,sys_userid=$4 where emp_id = $5',[id]);
//return result?.rows?.[0];
//} catch (error) {
//   return Promise.reject(error);
//  }
//}

export {
  //getEmpList,
  createUser,
  // deleteEmp,
  // updateEmp
}