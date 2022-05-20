const jwt = require('jsonwebtoken');

module.exports = function (app, verifyToken, db, connection) {
    // GET ALL VETERINARI - Nema ogranicenja
    app.get('/veterinari', (req, res) => {
        db.select('*')
            .from('Veterinar')
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

    //DELETE ALL VETERINARI - Samo Admin
    app.delete('/veterinari', verifyToken, (req, res) => {
        jwt.verify(req.token, 'authToken', (err, authData) => {
            if (err) {
                return res.status(404).json({ msg: 'Greska.' });
            } else if (authData.user.role == 'admin') {
                db('Veterinar')
                    .del()
                    .then((data) => {
                        if (!!data) {
                            return res.sendStatus(204);
                        }
                        res.status(404).json({ msg: 'Ne postoje rekordi za brisanje.' });
                    })
                    .catch((err) => {
                        res.status(404).json({ msg: 'Greska u brisanju svih veterinara.', error: err });
                    });
            } else {
                return res.status(403).json({ msg: 'Nemate privilegije za ovaj zahtev.' });
            }
        });
    });

    //UPDATE ALL VETERINARI - Samo Admin
    app.put('/veterinari', verifyToken, (req, res) => {
        jwt.verify(req.token, 'authToken', (err, authData) => {
            if (err) {
                return res.status(404).json({ msg: 'Greska.' });
            } else if (authData.user.role == 'admin') {
                const { ime, prezime, datumRodjenja, adresa, telefon, grad } = req.body;
                db('Veterinar')
                    .update(
                        {
                            prezime: prezime,
                            ime: ime,
                            datumRodjenja: datumRodjenja,
                            adresa: adresa,
                            telefon: telefon,
                            grad: grad
                        }
                    ).then((data) => {
                        if (!!data) {
                            return res.status(200).json({ msg: 'Svi Veterinari Azurirani' });
                        }
                        res.status(404).json({ msg: 'Ne postoje rekordi za azuriranje.' });
                    })
                    .catch((err) => {
                        res.status(409).json({ msg: 'Greska u azuriranju svih veterinara.', error: err });
                    });
            } else {
                res.status(403).json({ msg: 'Nemate privilegije za ovaj zahtev.' });
            }
        });
    });

    // GET VETERINAR BY ID - Nema ogranicenja
    app.get('/veterinari/:id', (req, res) => {
        const id = req.params.id;
        db.select('*')
            .from('Veterinar')
            .where('jmbg', '=', id)
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

    //DELETE VETERINAR BY ID - Samo Admin
    app.delete('/veterinari/:id', verifyToken, (req, res) => {
        jwt.verify(req.token, 'authToken', (err, authData) => {
            if (err) {
                return res.status(404).json({ msg: 'Greska.' });
            } else if (authData.user.role == 'admin') {
                const id = req.params.id;
                db('Veterinar')
                    .where('jmbg', '=', id)
                    .del()
                    .then((data) => {
                        if (!!data) {
                            return res.sendStatus(204);
                        }
                        res.status(404).json({ msg: 'Veterinar sa zadatim id-em ne postoji.' });
                    })
                    .catch((err) => {
                        res.status(404).json({ msg: 'Greska u brisanju veterinara.', error: err });
                    });
            } else {
                res.status(403).json({ msg: 'Nemate privilegije za ovaj zahtev.' });
            }
        });
    });

    //UPDATE VETERINAR BY ID - Samo Admin
    app.put('/veterinari/:id', verifyToken, (req, res) => {
        jwt.verify(req.token, 'authToken', (err, authData) => {
            if (err) {
                return res.status(404).json({ msg: 'Greska.' });
            } else if (authData.user.role == 'admin') {
                const id = req.params.id;
                const { ime, prezime, datumRodjenja, adresa, telefon, grad } = req.body;

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
                    ).then((data) => {
                        if (!!data) {
                            return res.status(200).json({ msg: 'Veterinar Azuriran' });
                        }
                        res.status(404).json({ msg: 'Veterinar sa zadatim id-em ne postoji.' });
                    })
                    .catch((err) => {
                        res.status(409).json({ msg: 'Greska u azuriranju veterinara.', error: err });
                    });
            } else {
                res.status(403).json({ msg: 'Nemate privilegije za ovaj zahtev.' });
            }
        });
    });

    //CREATE VETERINAR - Samo Admin
    app.post('/veterinari', verifyToken, (req, res) => {
        jwt.verify(req.token, 'authToken', (err, authData) => {
            if (err) {
                return res.status(404).json({ msg: 'Greska.' });
            } else if (authData.user.role == 'admin') {
                const { jmbg, ime, datumRodjenja, prezime, adresa, telefon, grad } = req.body;

                if (!jmbg && !ime && !datumRodjenja && !prezime && !adresa && !telefon && !grad) {
                    return res.status(400).json({ msg: 'Greska u kreiranju veterinara.' });
                };

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
                    .then((data) => {
                        if (!!data) {
                            return res.status(201).json({ msg: 'Veterinar Kreiran' });
                        }
                    })
                    .catch((err) => {
                        res.status(400).json({ msg: 'Greska u kreiranju veterinara.', error: err });
                    })
            } else {
                res.status(403).json({ msg: 'Nemate privilegije za ovaj zahtev.' });
            }
        });

    });
}