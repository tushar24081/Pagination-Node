const express = require("express");
const mysql2 = require("mysql2")
const dummy_array = ["tushar", "jay", "parth", "jayesh"];
const dummy_variable = "This is dummy var";
const bodyParser = require("body-parser")
const app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.set("view engine", "ejs"); //We must set this parameter if we want to use EJS as a template engine.
const connection = mysql2.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "Student"
})

connection.connect((err, acc) => {
    if (err) return console.log(err.message);
    return console.log("Connected Successfully");
})
var total_records;
app.get("/:page", (req, res) => {
    res.send(req.params.page);
})
app.get("/", (req, res) => {
    const limit = 100;
    connection.query(`select count(*) as tot from Student.Student_Express`, (err, ans) => {
        if (err) return console.log(err.message);
        total_records = ans[0].tot;
    })
    let page = req.query.page || 1;
    const sort = req.query.sort || "asc";
    var col = req.query.col || "sid";
    if (col == "University") col = "u.name";
    const offset = (page - 1) * limit;
    select_query = `select * from Student.Student_Express s INNER JOIN University_Mst u ON s.University = u.id order by ${col} ${sort} LIMIT ${offset}, ${limit} `;
    total_pages = Math.ceil(total_records / limit);

    connection.query(select_query, (err, ans) => {
        if (err) return console.log(err.message);
        res.render("index", { data: ans, page_no: page, total_pages: total_pages, col, sort });
    })
})
app.post("/search", (req, res) => {
    let searchString = req.body.query;
    let choice = req.body.op;
    console.log(choice);
    var delm = ["/", "$", "~", "^"];
    let singleName = "";
    for(let i=0; i<searchString.length; i++){
        if(delm.includes(searchString[i])){
            singleName += " " + searchString[i] ;
        }
        else{
            singleName += searchString[i]
        }
    }
    var nameArr = singleName.split(" ");
    console.log(nameArr);
    let queryString = "where";
    hasCameBefore = false;
    nameArr.forEach(name => {
        console.log(name[0]);
        if (name[0] == "^") {
            if (hasCameBefore) { 
                queryString += ` ${choice} First_Name LIKE '${name.slice(1)}%'` 
            }
            else { 
                queryString += ` First_Name LIKE '${name.slice(1)}%'`;
                hasCameBefore = true
            }
        }
        if (name[0] == "$") {
            if (hasCameBefore) {
                queryString += ` ${choice} Last_Name LIKE '${name.slice(1)}%'`
            }
            else {
                queryString += ` Last_Name LIKE '${name.slice(1)}%'`
                hasCameBefore = true

            }
        }
        if (name[0] == "~") {
            if (hasCameBefore) {
                queryString += ` ${choice} Email LIKE '${name.slice(1)}%'`
            }
            else {
                queryString += ` Last_Name LIKE '${name.slice(1)}%'`
                hasCameBefore = true

            }
        }
        if (name[0] == "/") {
            if (hasCameBefore) {
                queryString += `${choice} City LIKE '${name.slice(1)}%'`
            } else {
                queryString += ` City LIKE '${name.slice(1)}%'`
                hasCameBefore = true
            }
        }
        console.log(queryString);
    });
    var query = `select * from Student.Student_Express s INNER JOIN University_Mst u ON s.University = u.id
    ${queryString}`;
    connection.query(query, (err, ans) => {
        if (err) return res.send(err.message);
        res.render("search", { data: ans, searchString, choice })
    })
})

app.get("/render", (req, resp) => {
    let ans_array = [[], [], [], [], [], [], [], [], []]

    connection.query(`SELECT * FROM Student.Student_Express LIMIT 0, 10`, (err, res) => {
        if (err) return res.send(err.message);
        ans_array[0].push(...res)
    })
    connection.query(`SELECT * FROM Student.Student_Express LIMIT 10, 10`, (err, res) => {
        if (err) return res.send(err.message);
        ans_array[1].push(...res)
    })
    connection.query(`SELECT * FROM Student.Student_Express LIMIT 20, 10`, (err, res) => {
        if (err) return res.send(err.message);
        ans_array[2].push(...res)
    })
    connection.query(`SELECT * FROM Student.Student_Express LIMIT 30, 10`, (err, res) => {
        if (err) return res.send(err.message);
        ans_array[3].push(...res)
    })
    connection.query(`SELECT * FROM Student.Student_Express LIMIT 40, 10`, (err, res) => {
        if (err) return res.send(err.message);
        ans_array[4].push(...res)
    })
    connection.query(`SELECT * FROM Student.Student_Express LIMIT 50, 10`, (err, res) => {
        if (err) return res.send(err.message);
        ans_array[5].push(...res)
    })
    connection.query(`SELECT * FROM Student.Student_Express LIMIT 70, 10`, (err, res) => {
        if (err) return res.send(err.message);
        ans_array[6].push(...res)
    })
    connection.query(`SELECT * FROM Student.Student_Express LIMIT 80, 10`, (err, res) => {
        if (err) return res.send(err.message);
        ans_array[7].push(...res)
    })

    connection.query(`SELECT * FROM Student.Student_Express LIMIT 90, 10`, (err, res) => {
        if (err) return res.send(err.message);
        ans_array[8].push(...res)
        console.log(ans_array[0]);
        resp.render("tables", { data: ans_array })
    })


})
app.listen(3000, (req, res) => console.log("App is running"));

