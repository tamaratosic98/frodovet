const jwt = require('jsonwebtoken');

module.exports = function (app, verifyToken, db, connection, filterData) {
    // GET ALL ZIVOTINJE - Moze pristupiti samo Admin
    app.get('/zivotinje', verifyToken, (req, res) => {
        jwt.verify(req.token, 'authToken', (err, authData) => {
            if (err) {
                return res.status(404).json({ msg: 'Greska.' });
            } else if (authData.user.role === 'admin') {
                const query = req.query;
                const { limit, offset, filter } = query;
                db.select('*')
                    .from('Zivotinja')
                    .then((data) => {
                        if (!!data && data.length > 0) {
                            const filteredData = filterData(filter, data);
                            if (filteredData.length > 0) {
                                return res.status(200).json(filteredData);
                            }
                        }
                        res.sendStatus(204);
                    })
                    .catch((err) => {
                        res.status(404).json({ msg: 'Greska.', error: err });
                    });
            } else {
                res.status(403).json({ msg: 'Nemate privilegije za ovaj zahtev.' });
            }
        });
    });

    // UPDATE ALL ZIVOTINJE - samo Admin
    app.put('/zivotinje', verifyToken, (req, res) => {
        jwt.verify(req.token, 'authToken', (err, authData) => {
            if (err) {
                return res.status(404).json({ msg: 'Greska.' });
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
                    ).then((data) => {
                        if (!!data) {
                            return res.status(200).json({ msg: 'Sve Zivotinje Azurirane.' });
                        }
                        res.status(404).json({ msg: 'Ne postoje rekordi za azuriranje.' });
                    })
                    .catch((err) => {
                        return res.status(409).json({ msg: 'Greska u azuriranju svih zivotinja.', error: err });
                    });
            } else {
                res.status(403).json({ msg: 'Nemate privilegije za ovaj zahtev.' });
            }
        });
    });

    // DELETE ALL ZIVOTINJE - samo Admin
    app.delete('/zivotinje', verifyToken, (req, res) => {
        jwt.verify(req.token, 'authToken', (err, authData) => {
            if (err) {
                return res.status(404).json({ msg: 'Greska.' });
            } else if (authData.user.role == 'admin') {
                db('Zivotinja')
                    .del()
                    .then((data) => {
                        if (!!data) {
                            return res.sendStatus(204);
                        }
                        res.status(404).json({ msg: 'Ne postoje rekordi za brisanje.' });
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
                return res.status(404).json({ msg: 'Greska.' });
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
                                if (!!data && data.length > 0) {
                                    return res.status(200).json(data);
                                }
                                res.sendStatus(204);
                            })
                            .catch((err) => {
                                res.status(404).json({ msg: 'Greska.', error: err });
                            });

                    } else {
                        res.status(403).json({ msg: 'Nemate privilegije za ovaj zahtev.' });
                    }
                });
            }
        });
    });

    // DELETE ZIVOTINJA BY ID - Moze pristupiti Admin, ili korisnik ukoliko je vlasnik te zivotinje
    app.delete('/zivotinje/:id', verifyToken, (req, res) => {
        jwt.verify(req.token, 'authToken', (err, authData) => {
            if (err) {
                return res.status(404).json({ msg: 'Greska.' });
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
                            .then((data) => {
                                if (!!data) {
                                    return res.sendStatus(204);
                                }
                                res.status(404).json({ msg: 'Zivotinja sa zadatim id-em ne postoji.' });
                            })
                            .catch((err) => {
                                res.status(404).json({ msg: 'Greska u brisanju zivotinje.', error: err });
                            });
                    } else {
                        res.status(403).json({ msg: 'Nemate privilegije za ovaj zahtev.' });
                    }
                });
            }
        });
    });

    // UPDATE ZIVOTINJA BY ID - Moze pristupiti Admin, ili korisnik ukoliko je vlasnik te zivotinje
    app.put('/zivotinje/:id', verifyToken, (req, res) => {
        jwt.verify(req.token, 'authToken', (err, authData) => {
            if (err) {
                return res.status(404).json({ msg: 'Greska.' });
            } else {
                const id = req.params.id;
                connection.query('SELECT * FROM Zivotinja WHERE sifra = ?', [id], function (error, results, fields) {
                    if (error) {
                        throw error
                    }
                    if (authData.user.role == 'admin' || (results.length > 0 && results[0].vlasnik == authData.user.id)) {
                        const id = req.params.id;
                        const { ime, datumRodjenja, starost, vlasnik, kontaktVlasnika, rasa } = req.body;

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
                            ).then((data) => {
                                if (!!data) {
                                    return res.status(200).json({ msg: 'Zivotinja Azurirana.' });
                                }
                                res.status(404).json({ msg: 'Zivotinja sa zadatim id-em ne postoji.' });
                            })
                            .catch((err) => {
                                res.status(409).json({ msg: 'Greska u azuriranju zivotinje.', error: err });
                            });
                    } else {
                        res.status(403).json({ msg: 'Nemate privilegije za ovaj zahtev.' });
                    }
                });
            }
        });
    });

    // CREATE ZIVOTINJA - Ulogovani Admin ili korisnik
    app.post('/zivotinje', verifyToken, (req, res) => {
        jwt.verify(req.token, 'authToken', (err, authData) => {
            if (err) {
                return res.status(404).json({ msg: 'Greska.' });
            } else {
                const { ime, datumRodjenja, starost, kontaktVlasnika, rasa } = req.body;

                if (!ime && !datumRodjenja && !starost && !kontaktVlasnika && !rasa) {
                    return res.status(400).json({ msg: 'Greska u kreiranju zivotinje.' });
                };

                db('Zivotinja')
                    .insert({
                        ime: ime,
                        vlasnik: authData?.user?.id,
                        starost: starost,
                        datumRodjenja: datumRodjenja,
                        kontaktVlasnika: kontaktVlasnika,
                        rasa: rasa
                    })
                    .then((data) => {
                        if (!!data) {
                            return res.status(201).json({ msg: 'Zivotinja Kreirana' });
                        }
                    })
                    .catch((err) => {
                        res.status(400).json({ msg: 'Greska u kreiranju zivotinje.', error: err });
                    })
            }
        });
    });
}