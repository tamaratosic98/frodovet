const jwt = require('jsonwebtoken');

module.exports = function (app, verifyToken, db, connection, filterData) {
    // GET ALL RASE - Nema ogranicenja
    app.get('/rase', (req, res) => {
        const query = req.query;
        const { limit, offset, filter } = query;
        db.select('*')
            .from('Rasa')
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
    });

    //DELETE ALL RASE - Samo Admin
    app.delete('/rase', verifyToken, (req, res) => {
        jwt.verify(req.token, 'authToken', (err, authData) => {
            if (err) {
                return res.status(404).json({ msg: 'Greska.' });
            } else if (authData.user.role == 'admin') {
                db('Rasa')
                    .del()
                    .then((data) => {
                        if (!!data) {
                            return res.sendStatus(204);
                        }
                        res.status(404).json({ msg: 'Ne postoje rekordi za brisanje.' });
                    })
                    .catch((err) => {
                        return res.status(404).json({ msg: 'Greska u brisanju svih rasa.', error: err });
                    });
            } else {
                res.status(403).json({ msg: 'Nemate privilegije za ovaj zahtev.' });
            }
        });
    });

    //UPDATE ALL RASE - Samo Admin
    app.put('/rase', verifyToken, (req, res) => {
        jwt.verify(req.token, 'authToken', (err, authData) => {
            if (err) {
                return res.status(404).json({ msg: 'Greska.' });
            } else if (authData.user.role === 'admin') {
                const { naziv } = req.body;

                db('Rasa')
                    .update(
                        {
                            naziv: naziv
                        }
                    ).then((data) => {
                        if (!!data) {
                            return res.status(200).json({ msg: 'Sve Rase Azurirane.' });
                        }
                        res.status(404).json({ msg: 'Ne postoje rekordi za azuriranje.' });
                    })
                    .catch((err) => {
                        res.status(409).json({ msg: 'Greska u azuriranju svih rasa.', error: err });
                    });
            } else {
                res.status(403).json({ msg: 'Nemate privilegije za ovaj zahtev.' });
            }
        });
    });

    // GET RASA BY ID - Nema ogranicenja
    app.get('/rase/:id', (req, res) => {
        const id = req.params.id;
        db.select('*')
            .from('Rasa')
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

    //DELETE RASA BY ID - Samo Admin
    app.delete('/rase/:id', verifyToken, (req, res) => {
        jwt.verify(req.token, 'authToken', (err, authData) => {
            if (err) {
                return res.status(404).json({ msg: 'Greska.' });
            } else if (authData.user.role == 'admin') {
                const id = req.params.id;
                db('Rasa')
                    .where('sifra', '=', id)
                    .del()
                    .then((data) => {
                        if (!!data) {
                            return res.sendStatus(204);
                        }
                        res.status(404).json({ msg: 'Rasa sa zadatim id-em ne postoji.' });
                    })
                    .catch((err) => {
                        res.status(404).json({ msg: 'Greska u brisanju rase.', error: err });
                    });
            } else {
                res.status(403).json({ msg: 'Nemate privilegije za ovaj zahtev.' });
            }
        });
    });

    //UPDATE RASA BY ID - Samo Admin
    app.put('/rase/:id', verifyToken, (req, res) => {
        jwt.verify(req.token, 'authToken', (err, authData) => {
            if (err) {
                return res.status(404).json({ msg: 'Greska.' });
            } else if (authData.user.role === 'admin') {
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
                    ).then((data) => {
                        if (!!data) {
                            return res.status(200).json({ msg: 'Rasa Azurirana' });
                        }
                        res.status(404).json({ msg: 'Ne postoje rekordi za azuriranje.' });
                    })
                    .catch((err) => {
                        res.status(409).json({ msg: 'Greska u azuriranju rase.', error: err });
                    });
            } else {
                res.status(403).json({ msg: 'Nemate privilegije za ovaj zahtev.' });
            }
        });
    });

    //CREATE RASA - Samo Admin
    app.post('/rase', verifyToken, (req, res) => {
        jwt.verify(req.token, 'authToken', (err, authData) => {
            if (err) {
                return res.status(404).json({ msg: 'Greska.' });
            } else if (authData.user.role === 'admin') {
                const { sifra, naziv } = req.body;

                if (!naziv && !sifra) {
                    return res.status(400).json({ msg: 'Greska u kreiranju rase.' });
                };

                db('Rasa')
                    .insert({
                        sifra: sifra,
                        naziv: naziv
                    })
                    .then((data) => {
                        if (!!data) {
                            return res.status(201).json({ msg: 'Rasa Kreirana' });
                        }
                    })
                    .catch((err) => {
                        res.status(400).json({ msg: 'Greska u kreiranju rase.', error: err });
                    })
            } else {
                res.status(403).json({ msg: 'Nemate privilegije za ovaj zahtev.' });
            }
        });
    });
}
