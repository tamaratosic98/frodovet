const jwt = require('jsonwebtoken');

module.exports = function (app, verifyToken, db, connection) {
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

    //UPDATE ALL TERMINI  - samo Admin
    app.put('/termini', verifyToken, (req, res) => {
        jwt.verify(req.token, 'authToken', (err, authData) => {
            if (err) {
                res.status(403).json({ msg: 'Nemate privilegije za ovaj zahtev.' });
            } else if (authData.user.role == 'admin') {
                const { recept, dijagnoza, napomena } = req.body;

                db('Termin')
                    .update(
                        {
                            dijagnoza: dijagnoza,
                            recept: recept,
                            napomena: napomena
                        }
                    ).then((data) => {
                        if (!!data) {
                            return res.json({ msg: 'Svi Termini Azuriran' });
                        }
                        res.status(404).json({ msg: 'Ne postoje rekordi za azuriranje.' });
                    })
                    .catch((err) => {
                        res.status(409).json({ msg: 'Greska u azuriranju svih termina.', error: err });
                    });
            } else {
                res.status(403).json({ msg: 'Nemate privilegije za ovaj zahtev.' });
            }
        });
    });

    //DELETE ALL TERMINI - samo Admin 
    app.delete('/termini', verifyToken, (req, res) => {
        jwt.verify(req.token, 'authToken', (err, authData) => {
            if (err) {
                res.status(403).json({ msg: 'Nemate privilegije za ovaj zahtev.' });
            } else if (authData.user.role == 'admin') {
                db('Termin')
                    .del()
                    .then((data) => {
                        if (!!data) {
                            return res.sendStatus(204);
                        }
                        res.status(404).json({ msg: 'Ne postoje rekordi za brisanje.' });
                    })
                    .catch((err) => {
                        res.status(404).json({ msg: 'Greska u brisanju svih termina.', error: err });
                    });
            } else {
                res.status(403).json({ msg: 'Nemate privilegije za ovaj zahtev.' });
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
                res.status(403).json({ msg: 'Nemate privilegije za ovaj zahtev.' });
            } else {
                const idZivotinje = req.params.idZivotinje;
                const idVeterinara = req.params.idVeterinara;
                const datum = req.params.datum;
                connection.query('SELECT * FROM Zivotinja WHERE sifra = ?', [idZivotinje], function (error, results, fields) {
                    if (error) {
                        throw error;
                    }
                    if (authData.user.role == 'admin' || (results.length > 0 && results[0].vlasnik == authData.user.id)) {
                        db('Termin')
                            .where('zivotinja', '=', idZivotinje)
                            .where('pregledao', '=', idVeterinara)
                            .where('datum', '=', datum)
                            .del()
                            .then((data) => {
                                if (!!data) {
                                    return res.sendStatus(204);
                                }
                                res.status(404).json({ msg: 'Termin sa zadatim id-em ne postoji.' });
                            })
                            .catch((err) => {
                                res.status(404).json({ msg: 'Greska u brisanju termina.', error: err });
                            });
                    } else {
                        res.status(403).json({ msg: 'Nemate privilegije za ovaj zahtev.' });
                    }
                });
            }
        });
    });

    //UPDATE TERMIN BY COMPOSITE ID - Admin ili korisnik koji je vlasnik zivotinje
    app.put('/termini/:idZivotinje/:idVeterinara/:datum', verifyToken, (req, res) => {
        jwt.verify(req.token, 'authToken', (err, authData) => {
            if (err) {
                res.status(403).json({ msg: 'Nemate privilegije za ovaj zahtev.' });
            } else {
                const idZivotinje = req.params.idZivotinje;
                const idVeterinara = req.params.idVeterinara;
                const datum = req.params.datum;
                connection.query('SELECT * FROM Zivotinja WHERE sifra = ?', [idZivotinje], function (error, results, fields) {
                    if (error) {
                        throw error
                    }
                    if (authData.user.role == 'admin' || (results.length > 0 && results[0].vlasnik == authData.user.id)) {
                        const { recept, dijagnoza, napomena } = req.body;

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
                            ).then((data) => {
                                if (!!data) {
                                    return res.json({ msg: 'Termin Azuriran' });
                                }
                                res.status(404).json({ msg: 'Termin sa zadatim id-em ne postoji.' });
                            })
                            .catch((err) => {
                                res.status(409).json({ msg: 'Greska u azuriranju termina.', error: err });
                            });
                    } else {
                        res.status(403).json({ msg: 'Nemate privilegije za ovaj zahtev.' });
                    }
                });
            }
        });
    });

}