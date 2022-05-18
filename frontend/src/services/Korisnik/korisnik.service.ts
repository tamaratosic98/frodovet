import { AxiosFV } from "../../api/axios-helper";
import { TResponse } from "../../interfaces/common.interface";
import { TKorisnik } from "../../interfaces/models/Korisnik/korisnik.model";
import { ApiRoutesConstants } from "../../utils/contants";

interface IKorisnikService {
    all: () => Promise<TResponse<TKorisnik[]>>;
    byId: (id: number) => Promise<TResponse<TKorisnik>>,
    create: (item: TKorisnik) => Promise<TResponse<TKorisnik>>;
    update: (id: number, item: TKorisnik) => Promise<TResponse<TKorisnik>>;
    delete: (id: number) => Promise<TResponse<TKorisnik>>;
}

export const KorisnikService: IKorisnikService = {
    all: async (): Promise<TResponse<any>> => {
        const result = await AxiosFV.get(`/${ApiRoutesConstants.KORISNIK}`);

        return {
            data: result.data,
            status: result.status
        };
    },
    byId: async (id: number): Promise<TResponse<any>> => {
        const result = await AxiosFV.get(`/${ApiRoutesConstants.KORISNIK}/${id}`);

        return {
            data: result.data,
            status: result.status
        };
    },
    create: async (item: TKorisnik): Promise<TResponse<TKorisnik>> => {
        const result = await AxiosFV.post(`/${ApiRoutesConstants.KORISNIK}`, item);

        return {
            data: result.data,
            status: result.status
        };
    },
    update: async (id: number, item: TKorisnik): Promise<TResponse<TKorisnik>> => {
        const result = await AxiosFV.put(`/${ApiRoutesConstants.KORISNIK}/${id}`, item);

        return {
            data: result.data,
            status: result.status
        };
    },
    delete: async (id: number): Promise<TResponse<TKorisnik>> => {
        const result = await AxiosFV.delete(`/${ApiRoutesConstants.KORISNIK}/${id}`);

        return {
            data: result.data,
            status: result.status
        };
    }
};