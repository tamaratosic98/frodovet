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

//#region TABLE VETERINAR
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
//#endregion

//#region TABLE RASA
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
//#endregion

//#region TABLE LOKACIJA
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
//#endregion

//#region TABLE ZIVOTINJA
// GET ALL ZIVOTINJE
app.get('/zivotinje', (req, res) => {
    db.select('*')
        .from('Zivotinja')
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json({ msg: 'Greska.', error: err });
        });
});

// GET ZIVOTINJA BY ID
app.get('/zivotinje/:id', (req, res) => {
    const id = req.params.id;
    db.select('*')
        .from('Zivotinja')
        .where('sifra', '=', id)
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json({ msg: 'Greska.', error: err });
        });
});

//DELETE ZIVOTINJA BY ID 
app.delete('/zivotinje/:id', (req, res) => {
    const id = req.params.id;
    db('Zivotinja')
        .where('sifra', '=', id)
        .del()
        .then(() => {
            console.log('Zivotinja Obrisana');
            return res.json({ msg: 'Zivotinja Obrisana' });
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json({ msg: 'Greska u brisanju zivotinje.', error: err });
        });
});

//UPDATE ZIVOTINJA
app.put('/zivotinje/:id', (req, res) => {
    const id = req.params.id;
    const {
        ime,
        datumRodjenja,
        starost,
        vlasnik,
        kontaktVlasnika,
        rasa
    } = req.body;

    db('Zivotinja')
        .where('sifra', '=', id)
        .update(
            {
                ime: ime,
                vlasnik: vlasnik,
                starost: starost,
                datumRodjenja: datumRodjenja,
                kontaktVlasnika: kontaktVlasnika,
                rasa: rasa
            }
        ).then(() => {
            return res.json({ msg: 'Zivotinja Azurirana' });
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json({ msg: 'Greska u azuriranju zivotinje.', error: err });
        });
});

//CREATE ZIVOTINJA
app.post('/zivotinje', (req, res) => {
    const {
        ime,
        datumRodjenja,
        starost,
        vlasnik,
        kontaktVlasnika,
        rasa
    } = req.body;

    db('Zivotinja')
        .insert({
            ime: ime,
            vlasnik: vlasnik,
            starost: starost,
            datumRodjenja: datumRodjenja,
            kontaktVlasnika: kontaktVlasnika,
            rasa: rasa
        })
        .then(() => {

            return res.json({ msg: 'Zivotinja Kreirana' });
        })
        .catch((err) => {
            console.log(err);
            console.log('Status code:' + res.statusCode);
            res.status(400).json({ msg: 'Greska u kreiranju zivotinje.', error: err });
        })
});
//#endregion

//#region TABLE TERMIN
// GET ALL TERMIN
app.get('/termini', (req, res) => {
    db.select('*')
        .from('Termin')
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json({ msg: 'Greska.', error: err });
        });
});

// GET TERMIN BY COMPOSITE ID
app.get('/termini/:idZivotinje/:idVeterinara/:datum', (req, res) => {
    const idZivotinje = req.params.idZivotinje;
    const idVeterinara = req.params.idVeterinara;
    const datum = req.params.datum;

    db.select('*')
        .from('Termin')
        .where('zivotinja', '=', idZivotinje)
        .where('pregledao', '=', idVeterinara)
        .where('datum', '=', datum)
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json({ msg: 'Greska.', error: err });
        });
});

//DELETE TERMIN BY ID 
app.delete('/termini/:idZivotinje/:idVeterinara/:datum', (req, res) => {
    const idZivotinje = req.params.idZivotinje;
    const idVeterinara = req.params.idVeterinara;
    const datum = req.params.datum
    db('Termin')
        .where('zivotinja', '=', idZivotinje)
        .where('pregledao', '=', idVeterinara)
        .where('datum', '=', datum)
        .del()
        .then(() => {
            console.log('Termin Obrisan');
            return res.json({ msg: 'Termin Obrisan' });
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json({ msg: 'Greska u brisanju termina.', error: err });
        });
});

//UPDATE TERMIN
app.put('/termini/:idZivotinje/:idVeterinara/:datum', (req, res) => {
    const idZivotinje = req.params.idZivotinje;
    const idVeterinara = req.params.idVeterinara;
    const datum = req.params.datum
    const {
        recept,
        dijagnoza,
        napomena
    } = req.body;

    db('Termin')
        .where('zivotinja', '=', idZivotinje)
        .where('pregledao', '=', idVeterinara)
        .where('datum', '=', datum)
        .update(
            {
                dijagnoza: dijagnoza,
                recept: recept,
                napomena: napomena
            }
        ).then(() => {
            return res.json({ msg: 'Termin Azuriran' });
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json({ msg: 'Greska u azuriranju termina.', error: err });
        });
});

//CREATE TERMIN
app.post('/termini', (req, res) => {
    const {
        recept,
        dijagnoza,
        napomena,
        pregledao,
        zivotinja,
        datum
    } = req.body;

    db('Termin')
        .insert({
            dijagnoza: dijagnoza,
            recept: recept,
            napomena: napomena,
            pregledao: pregledao,
            zivotinja: zivotinja,
            datum: datum
        })
        .then(() => {

            return res.json({ msg: 'Termin Kreiran' });
        })
        .catch((err) => {
            console.log(err);
            console.log('Status code:' + res.statusCode);
            res.status(400).json({ msg: 'Greska u kreiranju termina.', error: err });
        })
});
//#endregion

//#region TABLE KORISNIK
// GET ALL KORISNICI
app.get('/korisnici', (req, res) => {
    db.select('*')
        .from('Korisnik')
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json({ msg: 'Greska.', error: err });
        });
});

// GET KORISNIK BY ID
app.get('/korisnici/:id', (req, res) => {
    const id = req.params.id;
    db.select('*')
        .from('Korisnik')
        .where('sifra', '=', id)
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json({ msg: 'Greska.', error: err });
        });
});

//DELETE KORISNIK BY ID 
app.delete('/korisnici/:id', (req, res) => {
    const id = req.params.id;
    db('Korisnik')
        .where('sifra', '=', id)
        .del()
        .then(() => {
            console.log('Korisnik Obrisan');
            return res.json({ msg: 'Korisnik Obrisan' });
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json({ msg: 'Greska u brisanju korisnika.', error: err });
        });
});

//UPDATE KORISNIK
app.put('/korisnici/:id', (req, res) => {
    const id = req.params.id;
    const {
        ime,
        prezime,
        kontakt,
        username,
        password,
        email,
        admin
    } = req.body;

    db('Korisnik')
        .where('sifra', '=', id)
        .update(
            {
                prezime: prezime,
                ime: ime,
                kontakt: kontakt,
                username: username,
                password: password,
                email: email,
                admin: admin
            }
        ).then(() => {
            return res.json({ msg: 'Korisnik Azuriran' });
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json({ msg: 'Greska u azuriranju korisnika.', error: err });
        });
});

//CREATE KORISNIK
app.post('/korisnici', (req, res) => {
    const {
        ime,
        prezime,
        kontakt,
        username,
        password,
        email,
        admin
    } = req.body;

    db('Korisnik')
        .insert({
            prezime: prezime,
            ime: ime,
            kontakt: kontakt,
            username: username,
            password: password,
            email: email,
            admin: admin
        })
        .then(() => {

            return res.json({ msg: 'Korisnik Kreiran' });
        })
        .catch((err) => {
            console.log(err);
            console.log('Status code:' + res.statusCode);
            res.status(400).json({ msg: 'Greska u kreiranju korisnika.', error: err });
        })
});
//#endregion

const port = 5000;
app.listen(port, () => console.log(`Server je pokrenut na portu ${port}, http://localhost:${port}`));