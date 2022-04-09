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

// TABLE VETERINAR
// GET ALL VETERINARI
app.get('/veterinari', (req, res) => {
    db.select('*')
        .from('Veterinar')
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json({ msg: 'Greska.', error: err });
        });
});

// GET VETERINAR BY ID
app.get('/veterinari/:id', (req, res) => {
    const id = req.params.id;
    db.select('*')
        .from('Veterinar')
        .where('jmbg', '=', id)
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json({ msg: 'Greska.', error: err });
        });
});

//DELETE VETERINAR BY ID 
app.delete('/veterinari/:id', (req, res) => {
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
            res.status(400).json({ msg: 'Greska u brisanju veterinara.', error: err });
        });
});

//UPDATE VETERINAR
app.put('/veterinari/:id', (req, res) => {
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
            res.status(400).json({ msg: 'Greska u azuriranju veterinara.', error: err });
        });
});

//CREATE VETERINAR
app.post('/veterinari', (req, res) => {
    const {
        jmbg,
        ime,
        datumRodjenja,
        prezime,
        adresa,
        telefon,
        grad
    } = req.body;

    db('Veterinar')
        .insert({
            jmbg: jmbg,
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
            console.log('Status code:' + res.statusCode);
            res.status(400).json({ msg: 'Greska u kreiranju veterinara.', error: err });
        })
});


// TABLE RASA
// GET ALL RASE
app.get('/rase', (req, res) => {
    db.select('*')
        .from('Rasa')
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json({ msg: 'Greska.', error: err });
        });
});

// GET RASA BY ID
app.get('/rase/:id', (req, res) => {
    const id = req.params.id;
    db.select('*')
        .from('Rasa')
        .where('sifra', '=', id)
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json({ msg: 'Greska.', error: err });
        });
});

//DELETE RASA BY ID 
app.delete('/rase/:id', (req, res) => {
    const id = req.params.id;
    db('Rasa')
        .where('sifra', '=', id)
        .del()
        .then(() => {
            console.log('Rasa Obrisana');
            return res.json({ msg: 'Rasa Obrisana' });
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json({ msg: 'Greska u brisanju rase.', error: err });
        });
});

//UPDATE RASA
app.put('/rase/:id', (req, res) => {
    const id = req.params.id;
    const {
        naziv
    } = req.body;

    db('Rasa')
        .where('sifra', '=', id)
        .update(
            {
                naziv: naziv
            }
        ).then(() => {
            return res.json({ msg: 'Rasa Azurirana' });
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json({ msg: 'Greska u azuriranju rase.', error: err });
        });
});

//CREATE RASA
app.post('/rase', (req, res) => {
    const {
        sifra,
        naziv
    } = req.body;

    db('Rasa')
        .insert({
            sifra: sifra,
            naziv: naziv
        })
        .then(() => {
            return res.json({ msg: 'Rasa Kreirana' });
        })
        .catch((err) => {
            console.log(err);
            console.log('Status code:' + res.statusCode);
            res.status(400).json({ msg: 'Greska u kreiranju rase.', error: err });
        })
});


// TABLE LOKACIJA
// GET ALL LOKACIJE
app.get('/lokacije', (req, res) => {
    db.select('*')
        .from('Lokacija')
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json({ msg: 'Greska.', error: err });
        });
});

// GET LOKACIJA BY ID
app.get('/lokacije/:id', (req, res) => {
    const id = req.params.id;
    db.select('*')
        .from('Lokacija')
        .where('sifra', '=', id)
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json({ msg: 'Greska.', error: err });
        });
});

//DELETE LOKACIJA BY ID 
app.delete('/lokacije/:id', (req, res) => {
    const id = req.params.id;
    db('Lokacija')
        .where('sifra', '=', id)
        .del()
        .then(() => {
            console.log('Lokacija Obrisana');
            return res.json({ msg: 'Lokacija Obrisana' });
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json({ msg: 'Greska u brisanju lokacije.', error: err });
        });
});

//UPDATE LOKACIJA
app.put('/lokacije/:id', (req, res) => {
    const id = req.params.id;
    const {
        naziv
    } = req.body;

    db('Lokacija')
        .where('sifra', '=', id)
        .update(
            {
                naziv: naziv
            }
        ).then(() => {
            return res.json({ msg: 'Lokacija Azurirana' });
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json({ msg: 'Greska u azuriranju lokacije.', error: err });
        });
});

//CREATE LOKACIJA
app.post('/lokacije', (req, res) => {
    const {
        sifra,
        naziv
    } = req.body;

    db('Lokacija')
        .insert({
            sifra: sifra,
            naziv: naziv
        })
        .then(() => {
            return res.json({ msg: 'Lokacija Kreirana' });
        })
        .catch((err) => {
            console.log(err);
            console.log('Status code:' + res.statusCode);
            res.status(400).json({ msg: 'Greska u kreiranju lokacije.', error: err });
        })
});


const port = 5000;
app.listen(port, () => console.log(`Server running on port ${port}, http://localhost:${port}`));