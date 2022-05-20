const jwt = require('jsonwebtoken');

module.exports = function (app, verifyToken, db, connection) {
    // GET ALL LOKACIJE - Nema ogranicenja
    app.get('/lokacije', (req, res) => {
        db.select('*')
            .from('Lokacija')
            .then((data) => {
                if (!!data && data.length > 0) {
                    return res.status(200).json(data);
                }
                res.sendStatus(204);
            })
            .catch((err) => {
                res.status(404).json({ msg: 'Greska.', error: err });
            });
    });

    // DELETE ALL LOKACIJE - Samo Admin
    app.delete('/lokacije', verifyToken, (req, res) => {
        jwt.verify(req.token, 'authToken', (err, authData) => {
            if (err) {
                return res.status(404).json({ msg: 'Greska.' });
            } else if (authData.user.role === 'admin') {
                db('Lokacija')
                    .del()
                    .then((data) => {
                        if (!!data) {
                            return res.sendStatus(204);
                        }
                        res.status(404).json({ msg: 'Ne postoje rekordi za brisanje.' });
                    })
                    .catch((err) => {
                        res.status(404).json({ msg: 'Greska u brisanju svih lokacija.', error: err });
                    });
            } else {
                return res.status(403).json({ msg: 'Nemate privilegije za ovaj zahtev.' });
            }
        });
    });

    // UPDATE ALL LOKACIJE - Samo Admin
    app.put('/lokacije', verifyToken, (req, res) => {
        jwt.verify(req.token, 'authToken', (err, authData) => {
            if (err) {
                return res.status(404).json({ msg: 'Greska.' });
            } else if (authData.user.role === 'admin') {
                const { naziv } = req.body;
                db('Lokacija')
                    .update(
                        {
                            naziv: naziv
                        }
                    ).then((data) => {
                        if (!!data) {
                            return res.status(200).json({ msg: 'Sve Lokacije Azurirane.' });
                        }
                        res.status(404).json({ msg: 'Ne postoje rekordi za azuriranje.' });
                    })
                    .catch((err) => {
                        res.status(409).json({ msg: 'Greska u azuriranju svih lokacija.', error: err });
                    });
            } else {
                return res.status(403).json({ msg: 'Nemate privilegije za ovaj zahtev.' });
            }
        });
    });

    // GET LOKACIJA BY ID - Nema ogranicenja
    app.get('/lokacije/:id', (req, res) => {
        const id = req.params.id;
        db.select('*')
            .from('Lokacija')
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
    });

    // DELETE LOKACIJA BY ID - Samo Admin
    app.delete('/lokacije/:id', verifyToken, (req, res) => {
        jwt.verify(req.token, 'authToken', (err, authData) => {
            if (err) {
                return res.status(404).json({ msg: 'Greska.' });
            } else if (authData.user.role === 'admin') {
                const id = req.params.id;
                db('Lokacija')
                    .where('sifra', '=', id)
                    .del()
                    .then((data) => {
                        if (!!data) {
                            return res.sendStatus(204);
                        }
                        res.status(404).json({ msg: 'Lokacija sa zadatim id-em ne postoji.' });
                    })
                    .catch((err) => {
                        res.status(404).json({ msg: 'Greska u brisanju lokacije.', error: err });
                    });
            } else {
                res.status(403).json({ msg: 'Nemate privilegije za ovaj zahtev.' });
            }
        });
    });

    // UPDATE LOKACIJA - Samo Admin
    app.put('/lokacije/:id', verifyToken, (req, res) => {
        jwt.verify(req.token, 'authToken', (err, authData) => {
            if (err) {
                return res.status(404).json({ msg: 'Greska.' });
            } else if (authData.user.role === 'admin') {
                const id = req.params.id;
                const { naziv } = req.body;

                db('Lokacija')
                    .where('sifra', '=', id)
                    .update(
                        {
                            naziv: naziv
                        }
                    ).then((data) => {
                        if (!!data) {
                            return res.status(200).json({ msg: 'Lokacija Azurirana' });
                        }
                        res.status(404).json({ msg: 'Lokacija sa zadatim id-em ne postoji.' });
                    })
                    .catch((err) => {
                        res.status(409).json({ msg: 'Greska u azuriranju lokacije.', error: err });
                    });
            } else {
                res.status(403).json({ msg: 'Nemate privilegije za ovaj zahtev.' });
            }
        });
    });

    // CREATE LOKACIJA - Samo Admin
    app.post('/lokacije', verifyToken, (req, res) => {
        jwt.verify(req.token, 'authToken', (err, authData) => {
            if (err) {
                return res.status(404).json({ msg: 'Greska.' });
            } else if (authData.user.role === 'admin') {
                const { naziv } = req.body;

                if (!naziv) {
                    return res.status(400).json({ msg: 'Greska u kreiranju lokacije.' });
                };

                db('Lokacija')
                    .insert({
                        naziv: naziv
                    })
                    .then((data) => {
                        if (!!data) {
                            return res.status(201).json({ msg: 'Lokacija Kreirana' });
                        }
                    })
                    .catch((err) => {
                        res.status(400).json({ msg: 'Greska u kreiranju lokacije.', error: err });
                    })
            } else {
                res.status(403).json({ msg: 'Nemate privilegije za ovaj zahtev.' });
            }
        });

    });
}