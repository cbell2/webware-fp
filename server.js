var http = require('http')
  , fs = require('fs')
  , url = require('url')
  , sql = require('sqlite3')
  , port = 8080
  , debug = true

// db setup
var db = new sql.Database('tasks.sqlite')

// server setup
var server = http.createServer(function (req, res) {
  var uri = url.parse(req.url)

  switch (uri.pathname) {
    case '/':
      send_file(res, 'login.html')
      break
    case '/login.html':
      send_file(res, 'login.html')
      break
    case '/main.html':
      send_file(res, 'main.html')
      break
    case '/PizzaPic.jpg':
      send_file(res, 'PizzaPic.jpg')
      break
    case '/FishPic.jpg':
      send_file(res, 'FishPic.jpg')
      break
    default:
      res.end('404 not found')
  }
})

server.listen(process.env.PORT || port)
console.log('listening on 8080')

// subroutines
function send_file(res, filename) {
  fs.readFile(
    filename,
    function (error, content) {
      res.writeHead(200, { 'Content-type': 'text/html' })
      res.end(content, 'utf-8')
    }
  )
}

// common technique for a 'unique' alphanumeric id 
function new_id() {
  return Date.now().toString(36)
}

// read all data from database and send to res
function read(res) {
  var tasks = []
  db.each(
    "SELECT id, title, sub, list FROM tasks",  // database query
    function (err, row) { tasks.push(row) }, // called for each row returned
    function () { res.end(JSON.stringify(tasks)) } // called last
  )
}

// update specific line in database, using info in req, the request from the client
function update(res, req) {
  //first, process incoming data, see https://nodejs.org/en/docs/guides/anatomy-of-an-http-transaction/
  let body = []
  req.on('data', (chunk) => {
    body.push(chunk)
  }).on('end', () => {
    body = Buffer.concat(body).toString()
    process(JSON.parse(body))
    res.end()
  })
  // https://stackoverflow.com/a/36600095
  // http://www.sqlitetutorial.net/sqlite-update/
  function process(row) {
    console.log(row);
    if (debug) console.log(row)
    var query = `
      UPDATE tasks 
      SET title  = '${row.title}',
          list  = '${row.list}',
          sub = '${row.sub}'
      WHERE
          id = '${row.id}'
    `
    if (debug) console.log(query)
    db.run(
      query,
      function (err) { res.end('task updated') }
    )
  }
}

// NEW

// update specific line in database, using info in req, the request from the client
function del(res, req) {
  //first, process incoming data, see https://nodejs.org/en/docs/guides/anatomy-of-an-http-transaction/
  let body = []
  req.on('data', (chunk) => {
    body.push(chunk)
  }).on('end', () => {
    body = Buffer.concat(body).toString()
    process(JSON.parse(body))
    res.end()
  })
  // https://stackoverflow.com/a/36600095
  // http://www.sqlitetutorial.net/sqlite-update/
  function process(row) {
    console.log(row);
    if (debug) console.log(row)
    var query = `
      DELETE
      FROM
        tasks
      WHERE
          id = '${row.id}'
    `
    if (debug) console.log(query)
    db.run(
      query,
      function (err) { res.end('task updated') }
    )
  }
}

// update specific line in database, using info in req, the request from the client
function create(res, req) {
  //first, process incoming data, see https://nodejs.org/en/docs/guides/anatomy-of-an-http-transaction/
  let body = []
  req.on('data', (chunk) => {
    body.push(chunk)
  }).on('end', () => {
    body = Buffer.concat(body).toString()
    process(JSON.parse(body))
    res.end()
  })
  // https://stackoverflow.com/a/36600095
  // http://www.sqlitetutorial.net/sqlite-update/
  function process(row) {
    console.log(row);
    if (debug) console.log(row)
    var query = `

    INSERT INTO tasks VALUES ('${row.id}', '${row.title}', '${row.sub}', '${row.list}')

    `
    if (debug) console.log(query)
    db.run(
      query,
      function (err) { res.end('task updated') }
    )
  }
}


