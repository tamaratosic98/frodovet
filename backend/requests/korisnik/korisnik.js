const jwt = require('jsonwebtoken');

module.exports = function (app, verifyToken, db, connection, filterData) {
    // GET ALL KORISNICI - samo Admin
    app.get('/korisnici', verifyToken, (req, res) => {
        jwt.verify(req.token, 'authToken', (err, authData) => {
            if (err) {
                return res.status(404).json({ msg: 'Greska.' });
            } else if (authData.user.role == 'admin') {
                const query = req.query;
                const { limit, offset, filter } = query;

                db.limit(limit)
                    .offset(offset)
                    .select('*')
                    .from('Korisnik')
                    .then((data) => {
                        if (!!data && data.length > 0) {
                            const filteredData = filterData(filter, data);
                            if (filteredData.length > 0) {
                                return res.status(200).json(filteredData);
                            }
                            res.sendStatus(204);
                        }
                    })
                    .catch((err) => {
                        res.status(404).json({ msg: 'Greska.', error: err });
                    });
            } else {
                res.status(403).json({ msg: 'Nemate privilegije za ovaj zahtev.' });
            }
        });
    });

    // CREATE KORISNIK - Nema ogranicenja
    app.post('/korisnici', (req, res) => {
        const { ime, prezime, kontakt, username, password, email, admin } = req.body;

        if (!ime && !prezime && !kontakt && !username && !password && !email && !admin) {
            return res.status(400).json({ msg: 'Greska u kreiranju korisnika.' });
        };

        db('Korisnik')
            .insert({
                prezime: prezime,
                ime: ime,
                kontakt: kontakt,
                username: username,
                password: password,
                email: email,
                admin: admin
            })
            .then((data) => {
                if (!!data) {
                    return res.status(201).json({ msg: 'Korisnik Kreiran' });
                }
            })
            .catch((err) => {
                res.status(400).json({ msg: 'Greska u kreiranju korisnika.', error: err });
            })
    });

    // DELETE ALL KORISNICI - samo Admin 
    app.delete('/korisnici', verifyToken, (req, res) => {
        jwt.verify(req.token, 'authToken', (err, authData) => {
            if (err) {
                return res.status(404).json({ msg: 'Greska.' });
            } else if (authData.user.role === 'admin') {
                db('Korisnik')
                    .del()
                    .then(() => {
                        if (!!data) {
                            return res.sendStatus(204);
                        }
                        res.status(404).json({ msg: 'Ne postoje rekordi za brisanje.' });
                    })
                    .catch((err) => {
                        res.status(404).json({ msg: 'Greska u brisanju svih korisnika.', error: err });
                    });
            } else {
                res.status(403).json({ msg: 'Nemate privilegije za ovaj zahtev.' });
            }
        });
    });

    // UPDATE ALL KORISNICI - samo Admin 
    app.put('/korisnici', verifyToken, (req, res) => {
        jwt.verify(req.token, 'authToken', (err, authData) => {
            if (err) {
                return res.status(404).json({ msg: 'Greska.' });
            } else if (authData.user.role === 'admin') {
                const { ime, prezime, kontakt, username, password, email, admin } = req.body;

                db('Korisnik')
                    .update(
                        {
                            prezime: prezime,
                            ime: ime,
                            kontakt: kontakt,
                            username: username,
                            password: password,
                            email: email,
                            admin: admin
                        }
                    ).then((data) => {
                        if (!!data) {
                            return res.status(200).json({ msg: 'Svi korisnici su azurirani.' });
                        }
                        res.status(404).json({ msg: 'Ne postoje rekordi za azuriranje.' });
                    })
                    .catch((err) => {
                        res.status(409).json({ msg: 'Greska u azuriranju svih korisnika.', error: err });
                    });
            } else {
                res.status(403).json({ msg: 'Nemate privilegije za ovaj zahtev.' });
            }
        });
    });

    // GET KORISNIK BY ID - Admin i ulogovani korisnik ukoliko je njegov id isti od trazenog
    app.get('/korisnici/:id', verifyToken, (req, res) => {
        const id = req.params.id;

        jwt.verify(req.token, 'authToken', (err, authData) => {
            if (err) {
                return res.status(404).json({ msg: 'Greska.' });
            } else if (authData.user.role === 'admin' || id == authData.user.id) {
                db.select('*')
                    .from('Korisnik')
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
    });

    // DELETE KORISNIK BY ID - Admin i ulogovani korisnik ukoliko je njegov id isti od trazenog
    app.delete('/korisnici/:id', verifyToken, (req, res) => {
        const id = req.params.id;

        jwt.verify(req.token, 'authToken', (err, authData) => {
            if (err) {
                return res.status(404).json({ msg: 'Greska.' });
            } else if (authData.user.role === 'admin' || id == authData.user.id) {
                db('Korisnik')
                    .where('sifra', '=', id)
                    .del()
                    .then((data) => {
                        if (!!data) {
                            return res.sendStatus(204);
                        }
                        res.status(404).json({ msg: 'Korisnik sa zadatim id-em ne postoji.' });
                    })
                    .catch((err) => {
                        res.status(404).json({ msg: 'Greska u brisanju korisnika.', error: err });
                    });
            } else {
                res.status(403).json({ msg: 'Nemate privilegije za ovaj zahtev.' });
            }
        });
    });

    // UPDATE KORISNIK BY ID - Admin i ulogovani korisnik ukoliko je njegov id isti od trazenog
    app.put('/korisnici/:id', verifyToken, (req, res) => {
        const id = req.params.id;

        jwt.verify(req.token, 'authToken', (err, authData) => {
            if (err) {
                return res.status(404).json({ msg: 'Greska.' });
            } else if (id == authData.user.id || authData.user.role === 'admin') {
                const { ime, prezime, kontakt, username, password, email, admin } = req.body;

                db('Korisnik')
                    .where('sifra', '=', id)
                    .update(
                        {
                            prezime: prezime,
                            ime: ime,
                            kontakt: kontakt,
                            username: username,
                            password: password,
                            email: email,
                            admin: admin
                        }
                    ).then((data) => {
                        if (!!data) {
                            return res.status(200).json({ msg: 'Korisnik Azuriran' });
                        }
                        res.status(404).json({ msg: 'Korisnik sa zadatim id-em ne postoji.' });
                    })
                    .catch((err) => {
                        res.status(409).json({ msg: 'Greska u azuriranju korisnika.', error: err });
                    });
            } else {
                res.status(403).json({ msg: 'Nemate privilegije za ovaj zahtev.' });
            }
        });
    });
}

