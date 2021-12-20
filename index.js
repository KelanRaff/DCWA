
var express = require('express');
var bodyParser = require('body-parser')
const { render } = require('express/lib/response');
var mySQLDAO = require('./mySQLDAO')
var mongoDAO = require('./mongoDAO')
var app = express()
const port =3000;

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended:false}))

app.get('/', (req, res)=>{
    res.sendFile(__dirname + "/homePage.html")
})

//STUDENTS PAGE
app.get('/students', (req, res)=>{
   mySQLDAO.getStudents()
        .then((result) => {
            res.render('showStudents', {students:result})
        })
        .catch((error) => {
            res.send(error)
        })
})

//MODULES PAGE
app.get('/modules', (req, res)=>{
    mySQLDAO.getModules()
    .then((result) => {
        console.log(result)
        res.render('showModules', {modules:result})
    })
    .catch((error) => {
        res.send(error)
    })
})

//STUDENT-MODULE PAGE
app.get('/modules/:mid', (req, res)=>{
    mySQLDAO.getModuleStudents(req.params.mid)
    .then((result) => {
        res.render('showList', {studentModules:result})
        
    })
    .catch((error) => {
        res.send(error)
    })
})

//DELETE-STUDENTS PAGE
app.get('/students/:sid', (req, res) => {
    mySQLDAO.deleteStudent(req.params.sid)
    .then((result) => {
        if(result.affectedRows == 0){
            res.send("<h3> Student" + req.params.sid + " doesnt exist.")
        } else {
            res.send("<h3> Student  " + req.params.sid + " Deleted.")
        }
    })
    .catch((error) => {
        console.log(error)
            res.send("<h3>ERROR: " + error.errno + " cannot delete Student with ID : " + req.params.student + " as they have ongoing modules</h3>")
    })
})

//LECTURERS PAGE
app.get('/lecturers', (req, res) => {
    mongoDAO.getLecturers()
    .then((documents) => {
        res.render('showLecturers', {lecturers:documents})
    })
    .catch((error)=>{
        res.send(error)
    })
})

app.get('/addLecturer',(req, res)=>{
    res.render('addLecturer')
})

app.post('/addLecturer',(req, res)=>{
    mongoDAO.addLecturer(req.body._id,req.body.name,req.body.dept)
    .then((result)=> {
        res.redirect("/lecturers")
    })
    .catch((error)=>{
        if (error.message.includes("10000")){
            res.send("Error: Employee with ID: " + req.body._id + " already exists")
        } else {
            res.send(error.message)
        }
       
    })
})


app.listen(port, ()=>{
    console.log("listening on 3000")
})