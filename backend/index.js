//#region APP CONFIG
const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const knex = require('knex');
const mysql = require('mysql');
require('dotenv').config();

const db = knex({
    client: 'mysql',
    connection: {
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE,
        port: process.env.PORT
    },
});

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

const connection = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

//#endregion

require('./requests/veterinar/veterinar')(app, verifyToken, db, connection);

require('./requests/rasa/rasa')(app, verifyToken, db, connection);

require('./requests/lokacija/lokacija')(app, verifyToken, db, connection);

require('./requests/zivotinja/zivotinja')(app, verifyToken, db, connection);

require('./requests/termin/termin')(app, verifyToken, db, connection);

require('./requests/korisnik/korisnik')(app, verifyToken, db, connection);

//#region AUTH
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!!username && !!password) {
        connection.query('SELECT * FROM Korisnik WHERE username = ? AND password = ?', [username, password], function (error, results, fields) {
            if (error) {
                throw error
            }

            if (results.length > 0) {
                const user = {
                    id: results[0].sifra,
                    username: username,
                    password: password,
                    role: results[0].admin === 1 ? 'admin' : 'korisnik'
                };

                jwt.sign({ user }, 'authToken', (err, token) => {
                    res.json({
                        token
                    });
                });

            } else {
                res.send('Pogresno korisnicko ime ili lozinka!');
            }
        });
    }
});
//#endregion 

//#region FUNCTIONS

function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ')[1];
        req.token = bearer;
        next();
    } else {
        res.status(401).json({ msg: 'Molimo vas ulogujte se da biste nastavili.' });
    };
}

//#endregion

const port = 5000;
app.listen(port, () => console.log(`Server je pokrenut na portu ${port}, http://localhost:${port}`));

