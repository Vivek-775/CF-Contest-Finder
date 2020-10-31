const express = require('express')
const path = require('path')
const hbs = require('hbs')
const getContests = require('./utils/getContest')


const app = express();
const port = process.env.PORT || 3000;

const options = {
  extensions: ['html', 'htm']
}

const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join('__dirname', '../templates/views');
const partialsPath = path.join('__dirname', '../templates/partials');

app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

app.use(express.static(publicDirectoryPath, options));

// --> Setting up the get requests for pages
app.get('', (req, res) => {
  res.render('index');
});

app.get('/howto', (req, res) => {
  res.render('howto');
});

app.get('/about', (req, res) => {
  res.render('about');
});

// --> Setting up the query string to take in user handles and provide the list of contests
app.get('/contests', (req, res) => {
  if (!req.query.user1 || !req.query.user2) {
    return res.send({
      error: 'You must provide user handles!'
    });
  }

  let search = "";
  if(!req.query.search)
    search = "0";
  else
    search = req.query.search;

  getContests(req.query.user1, req.query.user2, search, (error, data) => {
    if (error) {
      return res.send({
        error
      });
    }

    res.send([data[0], data[1], data[2], data[3], data[4]]);
  });
});

app.get('*', (req, res) => {
  res.render('404');
});

app.listen(port, () => {
  console.log(`Server is up and running on port ${port}`);
});