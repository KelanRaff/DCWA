var mysql = require('promise-mysql')

var pool;

mysql.createPool({
    connectionLimit : 10,
    host : 'localhost',
    user : 'root',
    password : 'root',
    database : 'collegeDB'
})
.then((result)=> {
    pool = result;
})
.catch((error) =>{
    console.log(error)
})

function getStudents(){
    return new Promise((resolve,reject) =>{
        pool.query('select * from student')
        .then((result) => {
            resolve(result)
        })
        .catch((error) => {
            reject(error)
        })
    })
}

function getModules(){
    return new Promise((resolve,reject) =>{
        pool.query('select * from module')
        .then((result) => {
            resolve(result)
        })
        .catch((error) => {
            reject(error)
        })
    })
}


function getModuleStudents(course_name){
    return new Promise((resolve,reject)=>{
            var myQuery = {
                sql: 'select s.sid,s.name,s.gpa from student s inner join student_module f on s.sid = f.sid inner join module m on f.mid = m.mid where m.mid= ?',
                values: [ course_name]
            }

        pool.query(myQuery)
        .then((result) => {
            resolve(result)
        })
        .catch((error) => {
            reject(error)
        })
    }
    )
}

function deleteStudent(sid){
    return new Promise((resolve,reject) => {
        var myQuery = {
            sql : 'delete from student where sid = ? ',
            values: [sid]
        }
        pool.query(myQuery)
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

function addStudent(sid, name, dept){
    return new Promise((resolve,reject)=>{
        var myQuery = {
            sql :'',
            values:[sid, name, dept]
        }
        pool.query(myQuery)
        .then((result) => {
            resolve(result)
        })
        .catch((error) => {
            reject(error)
        })
    })
}

module.exports = { getStudents , getModules , getModuleStudents , deleteStudent}