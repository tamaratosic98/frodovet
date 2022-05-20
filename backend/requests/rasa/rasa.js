module.exports = function (app, verifyToken, db) {
    // GET ALL RASE - Nema ogranicenja
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

    // GET RASA BY ID - Nema ogranicenja
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

    //DELETE RASA BY ID - Samo Admin
    app.delete('/rase/:id', verifyToken, (req, res) => {
        jwt.verify(req.token, 'authToken', (err, authData) => {
            if (err) {
                res.sendStatus(403);
            } else if (authData.user.role == 'admin') {
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
            } else {
                res.sendStatus(403);
                res.json({
                    message: "Nemate privilegije admina za izvrsavanje ovog zahteva!"
                });
            }
        });
    });

    //UPDATE RASA - Samo Admin
    app.put('/rase/:id', verifyToken, (req, res) => {
        jwt.verify(req.token, 'authToken', (err, authData) => {
            if (err) {
                res.sendStatus(403);
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
                    ).then(() => {
                        return res.json({ msg: 'Rasa Azurirana' });
                    })
                    .catch((err) => {
                        console.log(err);
                        res.status(400).json({ msg: 'Greska u azuriranju rase.', error: err });
                    });
            } else {
                res.sendStatus(403);
                res.json({
                    message: "Nemate privilegije admina za izvrsavanje ovog zahteva!"
                });
            }
        });
    });

    //CREATE RASA - Samo Admin
    app.post('/rase', verifyToken, (req, res) => {
        jwt.verify(req.token, 'authToken', (err, authData) => {
            if (err) {
                res.sendStatus(403);
            } else if (authData.user.role === 'admin') {
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
            } else {
                res.sendStatus(403);
                res.json({
                    message: "Nemate privilegije admina za izvrsavanje ovog zahteva!"
                });
            }
        });
    });
}
