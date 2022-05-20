const jwt = require('jsonwebtoken');

module.exports = function (app, verifyToken, db, connection) {
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

}