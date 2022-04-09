const express = require('express');
const cors = require('cors');
const knex = require('knex');
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

// VETERINARI
// GET ALL VETERINARI
app.get('/veterinar', (req, res) => {
    db.select('*')
        .from('Veterinar')
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            console.log(err);
        });
});

// GET VETERINAR BY ID
app.get('/veterinar/:id', (req, res) => {
    const id = req.params.id;
    db.select('*')
        .from('Veterinar')
        .where('jmbg', '=', id)
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            console.log(err);
        });
});

//DELETE VETERINAR BY ID 
app.delete('/delete-veterinar/:id', (req, res) => {
    const id = req.params.id;
    db('Veterinar')
        .where('jmbg', '=', id)
        .del()
        .then(() => {
            console.log('Veterinar Obrisan');
            return res.json({ msg: 'Veterinar Obrisan' });
        })
        .catch((err) => {
            console.log(err);
        });
});

//UPDATE FAKTURA
app.put('/update-veterinar/:id', (req, res) => {
    const id = req.params.id;
    const {
        ime,
        prezime,
        datumRodjenja,
        adresa,
        telefon,
        grad
    } = req.body;

    db('Veterinar')
        .where('jmbg', '=', id)
        .update(
            {
                prezime: prezime,
                ime: ime,
                datumRodjenja: datumRodjenja,
                adresa: adresa,
                telefon: telefon,
                grad: grad
            }
        ).then(() => {
            return res.json({ msg: 'Veterinar Azuriran' });
        })
        .catch((err) => {
            console.log(err);
        });
});

//CREATE VETERINAR
app.post('/create-veterinar', (req, res) => {
    const {
        ime,
        datumRodjenja,
        prezime,
        adresa,
        telefon,
        grad
    } = req.body;
    db('Veterinar')
        .insert({
            ime: ime,
            adresa: adresa,
            datumRodjenja: datumRodjenja,
            prezime: prezime,
            telefon: telefon,
            grad: grad
        })
        .then(() => {
            return res.json({ msg: 'Veterinar Kreiran' });
        })
        .catch((err) => {
            console.log(err);
        });
});





const port = 5000;
app.listen(port, () => console.log(`Server running on port ${port}, http://localhost:${port}`));