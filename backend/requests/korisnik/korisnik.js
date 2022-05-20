const jwt = require('jsonwebtoken');

module.exports = function (app, verifyToken, db, connection) {
    // GET ALL KORISNICI - samo Admin
    app.get('/korisnici', verifyToken, (req, res) => {
        jwt.verify(req.token, 'authToken', (err, authData) => {
            if (err) {
                res.sendStatus(403);
            } else if (authData.user.role == 'admin') {
                db.select('*')
                    .from('Korisnik')
                    .then((data) => {
                        res.json(data);
                    })
                    .catch((err) => {
                        console.log(err);
                        res.status(400).json({ msg: 'Greska.', error: err });
                    });
            } else {
                res.sendStatus(403);
                // res.json({
                //     message: "Nemate privilegije admina za izvrsavanje ovog zahteva!"
                // });
            }
        });
    });

    // GET KORISNIK BY ID - Admin i ulogovani korisnik ukoliko je njegov id isti od trazenog
    app.get('/korisnici/:id', verifyToken, (req, res) => {
        const id = req.params.id;

        jwt.verify(req.token, 'authToken', (err, authData) => {
            console.log(authData)

            if (err) {
                res.sendStatus(403);
            } else if (authData.user.role === 'admin' || id == authData.user.id) {
                db.select('*')
                    .from('Korisnik')
                    .where('sifra', '=', id)
                    .then((data) => {
                        res.json(data);
                    })
                    .catch((err) => {
                        console.log(err);
                        res.status(400).json({ msg: 'Greska.', error: err });
                    });
            } else {
                res.sendStatus(403);
                // res.json({
                //     message: "Nemate privilegije admina za izvrsavanje ovog zahteva!"
                // });
            }
        });
    });

    //DELETE KORISNIK BY ID - Admin i ulogovani korisnik ukoliko je njegov id isti od trazenog
    app.delete('/korisnici/:id', verifyToken, (req, res) => {
        const id = req.params.id;

        jwt.verify(req.token, 'authToken', (err, authData) => {
            if (err) {
                res.sendStatus(403);
            } else if (authData.user.role === 'admin' || id == authData.user.id) {
                db('Korisnik')
                    .where('sifra', '=', id)
                    .del()
                    .then(() => {
                        console.log('Korisnik Obrisan');
                        return res.json({ msg: 'Korisnik Obrisan' });
                    })
                    .catch((err) => {
                        console.log(err);
                        res.status(400).json({ msg: 'Greska u brisanju korisnika.', error: err });
                    });
            } else {
                res.sendStatus(403);
                // res.json({
                //     message: "Nemate privilegije admina za izvrsavanje ovog zahteva!"
                // });
            }
        });
    });

    //UPDATE KORISNIK - Admin i ulogovani korisnik ukoliko je njegov id isti od trazenog
    app.put('/korisnici/:id', verifyToken, (req, res) => {
        const id = req.params.id;

        jwt.verify(req.token, 'authToken', (err, authData) => {
            if (err) {
                res.sendStatus(403);
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
                    ).then(() => {
                        return res.json({ msg: 'Korisnik Azuriran' });
                    })
                    .catch((err) => {
                        console.log(err);
                        res.status(400).json({ msg: 'Greska u azuriranju korisnika.', error: err });
                    });
            } else {
                res.sendStatus(403);
                // res.json({
                //     message: "Nemate privilegije za izvrsavanje ovog zahteva!"
                // });
            }
        });
    });

    //CREATE KORISNIK - Nema nikakvih ogranicenja
    app.post('/korisnici', (req, res) => {
        const {
            ime,
            prezime,
            kontakt,
            username,
            password,
            email,
            admin
        } = req.body;

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
            .then(() => {

                return res.json({ msg: 'Korisnik Kreiran' });
            })
            .catch((err) => {
                console.log(err);
                console.log('Status code:' + res.statusCode);
                res.status(400).json({ msg: 'Greska u kreiranju korisnika.', error: err });
            })
    });
}