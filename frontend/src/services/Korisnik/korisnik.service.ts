import { AxiosFV } from "../../api/axios-helper";
import { TKorisnik } from "../../interfaces/models/Korisnik/korisnik.model";

type TResponse = {
    data: any,
    status: any
}
interface IKorisnikService {
    all: () => Promise<TResponse>;
    byId?: (id: number) => Promise<TKorisnik>,
    create?: (item: TKorisnik) => void;
    update?: (id: number, item: TKorisnik) => void;
    delete?: (id: number) => void;
}

export const KorisnikService: IKorisnikService = {
    all: async (): Promise<TResponse> => {
        const result = await AxiosFV.get(`/korisnici`);

        return {
            data: result.data,
            status: result.status
        };
    }
};