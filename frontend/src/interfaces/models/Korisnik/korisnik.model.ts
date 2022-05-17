export type TKorisnik = {
    sifra?: number;
    email?: string;
    ime?: string;
    prezime?: string;
    password?: string;
    username?: string;
    kontakt?: string;
    admin?: boolean; // TODO check if database returns 1 and 0 or true and false
}