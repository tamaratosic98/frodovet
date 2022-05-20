const jwt = require('jsonwebtoken');

module.exports = function (app, verifyToken, db, connection) {
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

    //UPDATE ALL ZIVOTINJE - samo Admin
    app.put('/zivotinje', verifyToken, (req, res) => {
        jwt.verify(req.token, 'authToken', (err, authData) => {
            if (err) {
                res.status(403).json({ msg: 'Nemate privilegije za ovaj zahtev.' });
            } else if (authData.user.role == 'admin') {
                const { ime, datumRodjenja, starost, vlasnik, kontaktVlasnika, rasa } = req.body;
                db('Zivotinja')
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
                        return res.status(200).json({ msg: 'Sve Zivotinje Azurirane.' });
                    })
                    .catch((err) => {
                        return res.status(409).json({ msg: 'Greska u azuriranju svih zivotinja.', error: err });
                    });
            } else {
                res.status(403).json({ msg: 'Nemate privilegije za ovaj zahtev.' });
            }
        });
    });

    //DELETE ALL ZIVOTINJE - samo Admin
    app.delete('/zivotinje', verifyToken, (req, res) => {
        jwt.verify(req.token, 'authToken', (err, authData) => {
            if (err) {
                res.status(403).json({ msg: 'Nemate privilegije za ovaj zahtev.' });
            } else if (authData.user.role == 'admin') {
                db('Zivotinja')
                    .del()
                    .then(() => {
                        return res.sendStatus(204);
                    })
                    .catch((err) => {
                        res.status(404).json({ msg: 'Greska u brisanju svih zivotinja.', error: err });
                    });
            } else {
                res.status(403).json({ msg: 'Nemate privilegije za ovaj zahtev.' });
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

    //UPDATE ZIVOTINJA BY ID - Moze pristupiti Admin, ili korisnik ukoliko je vlasnik te zivotinje
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
}