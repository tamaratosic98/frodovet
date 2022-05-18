import { AxiosFV } from "../../api/axios-helper";
import { TResponse } from "../../interfaces/common.interface";
import { TLokacija } from "../../interfaces/models/Lokacija/lokacija.model";
import { ApiRoutesConstants } from "../../utils/contants";

interface ILokacijaService {
    all: () => Promise<TResponse<TLokacija[]>>;
    byId?: (id: number) => Promise<TResponse<TLokacija>>,
    create?: (item: TLokacija) => Promise<TResponse<TLokacija>>;
    update?: (id: number, item: TLokacija) => Promise<TResponse<TLokacija>>;
    delete?: (id: number) => Promise<TResponse<TLokacija>>;
}

export const LokacijaService: ILokacijaService = {
    all: async (): Promise<TResponse<any>> => {
        const result = await AxiosFV.get(`/${ApiRoutesConstants.LOKACIJA}`);

        return {
            data: result.data,
            status: result.status
        };
    },
    byId: async (id: number): Promise<TResponse<any>> => {
        const result = await AxiosFV.get(`/${ApiRoutesConstants.LOKACIJA}/${id}`);

        return {
            data: result.data,
            status: result.status
        };
    },
    create: async (item: TLokacija): Promise<TResponse<TLokacija>> => {
        const result = await AxiosFV.post(`/${ApiRoutesConstants.LOKACIJA}`, item);

        return {
            data: result.data,
            status: result.status
        };
    },
    update: async (id: number, item: TLokacija): Promise<TResponse<TLokacija>> => {
        const result = await AxiosFV.put(`/${ApiRoutesConstants.LOKACIJA}/${id}`, item);

        return {
            data: result.data,
            status: result.status
        };
    },
    delete: async (id: number): Promise<TResponse<TLokacija>> => {
        const result = await AxiosFV.delete(`/${ApiRoutesConstants.LOKACIJA}/${id}`);

        return {
            data: result.data,
            status: result.status
        };
    }
};