import { AxiosFV } from "../../api/axios-helper";
import { TResponse } from "../../interfaces/common.interface";
import { TRasa } from "../../interfaces/models/Rasa/rasa.model";
import { ApiRoutesConstants } from "../../utils/contants";

interface IRasaService {
    all: () => Promise<TResponse<TRasa[]>>;
    byId: (id: number) => Promise<TResponse<TRasa>>,
    create: (item: TRasa) => Promise<TResponse<TRasa>>;
    update: (id: number, item: TRasa) => Promise<TResponse<TRasa>>;
    delete: (id: number) => Promise<TResponse<TRasa>>;
}

export const RasaService: IRasaService = {
    all: async (): Promise<TResponse<any>> => {
        const result = await AxiosFV.get(`/${ApiRoutesConstants.RASA}`);

        return {
            data: result.data,
            status: result.status
        };
    },
    byId: async (id: number): Promise<TResponse<any>> => {
        const result = await AxiosFV.get(`/${ApiRoutesConstants.RASA}/${id}`);

        return {
            data: result.data,
            status: result.status
        };
    },
    create: async (item: TRasa): Promise<TResponse<TRasa>> => {
        const result = await AxiosFV.post(`/${ApiRoutesConstants.RASA}`, item);

        return {
            data: result.data,
            status: result.status
        };
    },
    update: async (id: number, item: TRasa): Promise<TResponse<TRasa>> => {
        const result = await AxiosFV.put(`/${ApiRoutesConstants.RASA}/${id}`, item);

        return {
            data: result.data,
            status: result.status
        };
    },
    delete: async (id: number): Promise<TResponse<TRasa>> => {
        const result = await AxiosFV.delete(`/${ApiRoutesConstants.RASA}/${id}`);

        return {
            data: result.data,
            status: result.status
        };
    }
};