import { AxiosFV } from "../../api/axios-helper";
import { TResponse } from "../../interfaces/common.interface";
import { TVeterinar } from "../../interfaces/models/Veterinar/veterinar.model";
import { ApiRoutesConstants } from "../../utils/contants";

interface IVeterinarService {
    all: () => Promise<TResponse<TVeterinar[]>>;
    byId: (id: string) => Promise<TResponse<TVeterinar>>,
    create: (item: TVeterinar) => Promise<TResponse<TVeterinar>>;
    update: (id: string, item: TVeterinar) => Promise<TResponse<TVeterinar>>;
    delete: (id: string) => Promise<TResponse<TVeterinar>>;
}

export const VeterinarService: IVeterinarService = {
    all: async (): Promise<TResponse<any>> => {
        const result = await AxiosFV.get(`/${ApiRoutesConstants.VETERINAR}`);

        return {
            data: result.data,
            status: result.status
        };
    },
    byId: async (id: string): Promise<TResponse<any>> => {
        const result = await AxiosFV.get(`/${ApiRoutesConstants.VETERINAR}/${id}`);

        return {
            data: result.data,
            status: result.status
        };
    },
    create: async (item: TVeterinar): Promise<TResponse<TVeterinar>> => {
        const result = await AxiosFV.post(`/${ApiRoutesConstants.VETERINAR}`, item);

        return {
            data: result.data,
            status: result.status
        };
    },
    update: async (id: string, item: TVeterinar): Promise<TResponse<TVeterinar>> => {
        const result = await AxiosFV.put(`/${ApiRoutesConstants.VETERINAR}/${id}`, item);

        return {
            data: result.data,
            status: result.status
        };
    },
    delete: async (id: string): Promise<TResponse<TVeterinar>> => {
        const result = await AxiosFV.delete(`/${ApiRoutesConstants.VETERINAR}/${id}`);

        return {
            data: result.data,
            status: result.status
        };
    }
};