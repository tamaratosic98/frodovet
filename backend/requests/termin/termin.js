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
                res.sendStatus(403);
            } else if (authData.user.role == 'admin') {
                const { recept, dijagnoza, napomena } = req.body;

                db('Termin')
                    .update(
                        {
                            dijagnoza: dijagnoza,
                            recept: recept,
                            napomena: napomena
                        }
                    ).then(() => {
                        return res.json({ msg: 'Svi Termini Azuriran' });
                    })
                    .catch((err) => {
                        console.log(err);
                        res.status(400).json({ msg: 'Greska u azuriranju svih termina.', error: err });
                    });
            } else {
                res.sendStatus(403);
                // res.send('Nemate dozvolu za azuriranje ovog termina.');
            }
        });
    });

    //DELETE ALL TERMINI - samo Admin 
    app.delete('/termini', verifyToken, (req, res) => {
        jwt.verify(req.token, 'authToken', (err, authData) => {
            if (err) {
                res.sendStatus(403);
            } else if (authData.user.role == 'admin') {
                db('Termin')
                    .del()
                    .then(() => {
                        return res.json({ msg: 'Svi Termini Obrisani' });
                    })
                    .catch((err) => {
                        console.log(err);
                        res.status(400).json({ msg: 'Greska u brisanju svih termina.', error: err });
                    });
            } else {
                res.sendStatus(403);
                // res.send('Nemate dozvolu za brisanje ovog termina.');
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

}