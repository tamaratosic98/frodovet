const jwt = require('jsonwebtoken');

module.exports = function (app, verifyToken, db, connection) {
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
}