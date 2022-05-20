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

//#region TABLE VETERINAR
// GET ALL VETERINARI - Nema ogranicenja
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

// GET VETERINAR BY ID - Nema ogranicenja
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

//DELETE VETERINAR BY ID - Samo Admin
app.delete('/veterinari/:id', verifyToken, (req, res) => {
    jwt.verify(req.token, 'authToken', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else if (authData.user.role == 'admin') {
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
        } else {
            res.sendStatus(403);
            // res.json({
            //     message: "Nemate privilegije admina za izvrsavanje ovog zahteva!"
            // });
        }
    });
});

//UPDATE VETERINAR - Samo Admin
app.put('/veterinari/:id', verifyToken, (req, res) => {
    jwt.verify(req.token, 'authToken', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else if (authData.user.role == 'admin') {
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
        } else {
            res.sendStatus(403);
            // res.json({
            //     message: "Nemate privilegije admina za izvrsavanje ovog zahteva!"
            // });
        }
    });
});

//CREATE VETERINAR - Samo Admin
app.post('/veterinari', verifyToken, (req, res) => {
    jwt.verify(req.token, 'authToken', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else if (authData.user.role == 'admin') {
            const { jmbg, ime, datumRodjenja, prezime, adresa, telefon, grad } = req.body;

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
                    return res.json({ msg: 'Veterinar Kreiran', authData: authData });
                })
                .catch((err) => {
                    console.log(err);
                    console.log('Status code:' + res.statusCode);
                    res.status(400).json({ msg: 'Greska u kreiranju veterinara.', error: err });
                })
        } else {
            res.sendStatus(403);
            // res.json({
            //     message: "Nemate privilegije admina za izvrsavanje ovog zahteva!"
            // });
        }
    });

});
//#endregion

require('./requests/rasa/rasa')(app, verifyToken, db);

//#region TABLE LOKACIJA
// GET ALL LOKACIJE - Nema ogranicenja
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

// GET LOKACIJA BY ID - Nema ogranicenja
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

//DELETE LOKACIJA BY ID - Samo Admin
app.delete('/lokacije/:id', verifyToken, (req, res) => {
    jwt.verify(req.token, 'authToken', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else if (authData.user.role === 'admin') {
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
        } else {
            res.sendStatus(403);
            res.json({
                message: "Nemate privilegije admina za izvrsavanje ovog zahteva!"
            });
        }
    });

});

//UPDATE LOKACIJA - Samo Admin
app.put('/lokacije/:id', verifyToken, (req, res) => {
    jwt.verify(req.token, 'authToken', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else if (authData.user.role === 'admin') {
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
        } else {
            res.sendStatus(403);
            res.json({
                message: "Nemate privilegije admina za izvrsavanje ovog zahteva!"
            });
        }
    });
});

//CREATE LOKACIJA - Samo Admin
app.post('/lokacije', verifyToken, (req, res) => {
    jwt.verify(req.token, 'authToken', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else if (authData.user.role === 'admin') {
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
        } else {
            res.sendStatus(403);
            res.json({
                message: "Nemate privilegije admina za izvrsavanje ovog zahteva!"
            });
        }
    });

});
//#endregion

//#region TABLE ZIVOTINJA
// GET ALL ZIVOTINJE - Moze pristupiti samo Admin
app.get('/zivotinje', verifyToken, (req, res) => {
    jwt.verify(req.token, 'authToken', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else if (authData.user.role === 'admin') {
            db.select('*')
                .from('Zivotinja')
                .then((data) => {
                    res.json(data);
                })
                .catch((err) => {
                    console.log(err);
                    res.status(400).json({ msg: 'Greska.', error: err });
                });
        } else {
            res.sendStatus(403);
            // res.json({
            //     message: "Nemate privilegije admina za izvrsavanje ovog zahteva!"
            // });
        }
    });
});

// GET ZIVOTINJA BY ID - Moze pristupiti Admin, ili korisnik ukoliko je vlasnik te zivotinje
app.get('/zivotinje/:id', verifyToken, (req, res) => {
    jwt.verify(req.token, 'authToken', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            const id = req.params.id;
            connection.query('SELECT * FROM Zivotinja WHERE sifra = ?', [id], function (error, results, fields) {
                if (error) {
                    throw error
                }
                if (authData.user.role == 'admin' || (results.length > 0 && results[0].vlasnik == authData.user.id)) {
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

                } else {
                    res.sendStatus(403);
                    // res.send('Nemate dozvolu za pregled ovog ljubimca.');
                }
            });
        }
    });
});

//DELETE ZIVOTINJA BY ID - Moze pristupiti Admin, ili korisnik ukoliko je vlasnik te zivotinje
app.delete('/zivotinje/:id', verifyToken, (req, res) => {
    jwt.verify(req.token, 'authToken', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            const id = req.params.id;
            connection.query('SELECT * FROM Zivotinja WHERE sifra = ?', [id], function (error, results, fields) {
                if (error) {
                    throw error
                }
                if (authData.user.role == 'admin' || (results.length > 0 && results[0].vlasnik == authData.user.id)) {
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
                } else {
                    res.sendStatus(403);
                    // res.send('Nemate dozvolu za pregled ovog ljubimca.');
                }
            });
        }
    });
});

//UPDATE ZIVOTINJA - Moze pristupiti Admin, ili korisnik ukoliko je vlasnik te zivotinje
app.put('/zivotinje/:id', verifyToken, (req, res) => {
    jwt.verify(req.token, 'authToken', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            const id = req.params.id;
            connection.query('SELECT * FROM Zivotinja WHERE sifra = ?', [id], function (error, results, fields) {
                if (error) {
                    throw error
                }
                if (authData.user.role == 'admin' || (results.length > 0 && results[0].vlasnik == authData.user.id)) {
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
                } else {
                    res.sendStatus(403);
                    // res.send('Nemate dozvolu za pregled ovog ljubimca.');
                }
            });
        }
    });
});

//CREATE ZIVOTINJA - Ulogovani Admin ili korisnik
app.post('/zivotinje', verifyToken, (req, res) => {
    jwt.verify(req.token, 'authToken', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
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
        }
    });
});
//#endregion

//#region TABLE TERMIN
// GET ALL TERMIN - Ulogovani Admin ili korisnik
app.get('/termini', verifyToken, (req, res) => {
    jwt.verify(req.token, 'authToken', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else if (authData.user.role === 'admin') {
            db.select('*')
                .from('Termin')
                .then((data) => {
                    res.json(data);
                })
                .catch((err) => {
                    console.log(err);
                    res.status(400).json({ msg: 'Greska.', error: err });
                });
        } else {
            res.sendStatus(403);
            res.json({
                message: "Nemate privilegije admina za izvrsavanje ovog zahteva!"
            });
        }
    });

});

// GET TERMIN BY COMPOSITE ID - Admin ili korisnik koji je vlasnik zivotinje
app.get('/termini/:idZivotinje/:idVeterinara/:datum', verifyToken, (req, res) => {
    jwt.verify(req.token, 'authToken', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            const idZivotinje = req.params.idZivotinje;
            const idVeterinara = req.params.idVeterinara;
            const datum = req.params.datum;
            connection.query('SELECT * FROM Zivotinja WHERE sifra = ?', [idZivotinje], function (error, results, fields) {
                if (error) {
                    throw error
                }
                if (authData.user.role == 'admin' || (results.length > 0 && results[0].vlasnik == authData.user.id)) {
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

                } else {
                    res.sendStatus(403);
                    // res.send('Nemate dozvolu za pregled ovog termina.');
                }
            });
        }
    });
});

//DELETE TERMIN BY COMPOSITE ID - Admin ili korisnik koji je vlasnik zivotinje
app.delete('/termini/:idZivotinje/:idVeterinara/:datum', verifyToken, (req, res) => {
    jwt.verify(req.token, 'authToken', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            const idZivotinje = req.params.idZivotinje;
            const idVeterinara = req.params.idVeterinara;
            const datum = req.params.datum;
            connection.query('SELECT * FROM Zivotinja WHERE sifra = ?', [idZivotinje], function (error, results, fields) {
                if (error) {
                    throw error
                }
                if (authData.user.role == 'admin' || (results.length > 0 && results[0].vlasnik == authData.user.id)) {
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
                } else {
                    res.sendStatus(403);
                    // res.send('Nemate dozvolu za brisanje ovog termina.');
                }
            });
        }
    });
});

//UPDATE TERMIN BY COMPOSITE ID - Admin ili korisnik koji je vlasnik zivotinje
app.put('/termini/:idZivotinje/:idVeterinara/:datum', verifyToken, (req, res) => {
    jwt.verify(req.token, 'authToken', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            const idZivotinje = req.params.idZivotinje;
            const idVeterinara = req.params.idVeterinara;
            const datum = req.params.datum;
            connection.query('SELECT * FROM Zivotinja WHERE sifra = ?', [idZivotinje], function (error, results, fields) {
                if (error) {
                    throw error
                }
                if (authData.user.role == 'admin' || (results.length > 0 && results[0].vlasnik == authData.user.id)) {
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
                } else {
                    res.sendStatus(403);
                    // res.send('Nemate dozvolu za azuriranje ovog termina.');
                }
            });
        }
    });
});

//CREATE TERMIN Ulogovani Admin ili korisnik
app.post('/termini', verifyToken, (req, res) => {
    jwt.verify(req.token, 'authToken', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
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
        }
    });
});
//#endregion

//#region TABLE KORISNIK
// GET ALL KORISNICI - samo Admin
app.get('/korisnici', verifyToken, (req, res) => {
    jwt.verify(req.token, 'authToken', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else if (authData.user.role == 'admin') {
            db.select('*')
                .from('Korisnik')
                .then((data) => {
                    res.json(data);
                })
                .catch((err) => {
                    console.log(err);
                    res.status(400).json({ msg: 'Greska.', error: err });
                });
        } else {
            res.sendStatus(403);
            // res.json({
            //     message: "Nemate privilegije admina za izvrsavanje ovog zahteva!"
            // });
        }
    });
});

// GET KORISNIK BY ID - Admin i ulogovani korisnik ukoliko je njegov id isti od trazenog
app.get('/korisnici/:id', verifyToken, (req, res) => {
    const id = req.params.id;

    jwt.verify(req.token, 'authToken', (err, authData) => {
        console.log(authData)

        if (err) {
            res.sendStatus(403);
        } else if (authData.user.role === 'admin' || id == authData.user.id) {
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
        } else {
            res.sendStatus(403);
            // res.json({
            //     message: "Nemate privilegije admina za izvrsavanje ovog zahteva!"
            // });
        }
    });
});

//DELETE KORISNIK BY ID - Admin i ulogovani korisnik ukoliko je njegov id isti od trazenog
app.delete('/korisnici/:id', verifyToken, (req, res) => {
    const id = req.params.id;

    jwt.verify(req.token, 'authToken', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else if (authData.user.role === 'admin' || id == authData.user.id) {
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
        } else {
            res.sendStatus(403);
            // res.json({
            //     message: "Nemate privilegije admina za izvrsavanje ovog zahteva!"
            // });
        }
    });
});

//UPDATE KORISNIK - Admin i ulogovani korisnik ukoliko je njegov id isti od trazenog
app.put('/korisnici/:id', verifyToken, (req, res) => {
    const id = req.params.id;

    jwt.verify(req.token, 'authToken', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else if (id == authData.user.id || authData.user.role === 'admin') {
            const { ime, prezime, kontakt, username, password, email, admin } = req.body;

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
        } else {
            res.sendStatus(403);
            // res.json({
            //     message: "Nemate privilegije za izvrsavanje ovog zahteva!"
            // });
        }
    });
});

//CREATE KORISNIK - Nema nikakvih ogranicenja
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
        res.sendStatus(403);
        // res.json({
        //     message: 'Nemate dozvolu da izvrsite ovaj zahtev.'
        // })
    };
}

//#endregion

const port = 5000;
app.listen(port, () => console.log(`Server je pokrenut na portu ${port}, http://localhost:${port}`));

