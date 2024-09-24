const express = require('express');
const path = require('path')
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const app = express();
const port = 4000;

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const corsOptions = {
  origin: '*'
};

const seedUser = require('./seeds/seedUser')
const trustedEntity = require('./seeds/trustedEntity')
const account = require('./routes/accountRoutes')
const transaction = require('./routes/transaction')
const createTLTransfer = require('./routes/createTLTransfer')
const user = require('./routes/user')
const offer = require('./routes/offer')
const admin = require ('./routes/admin')

trustedEntity()
seedUser()

app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to the platform!');
  console.log(req);
});

app.use('/account', account)
app.use('/transaction', transaction)
app.use('/trustline', createTLTransfer)
app.use('/user', user)
app.use('/offer', offer)
app.use('/admin', admin)

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
