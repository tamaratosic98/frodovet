import { AxiosFV } from "../../api/axios-helper";
import { TResponse } from "../../interfaces/common.interface";
import { TVeterinar } from "../../interfaces/models/Veterinar/veterinar.model";
import { ApiRoutesConstants } from "../../utils/contants";

interface IZivotinjaService {
    all: () => Promise<TResponse<TVeterinar[]>>;
    byId?: (id: number) => Promise<TResponse<TVeterinar>>,
    create?: (item: TVeterinar) => Promise<TResponse<TVeterinar>>;
    update?: (id: number, item: TVeterinar) => Promise<TResponse<TVeterinar>>;
    delete?: (id: number) => Promise<TResponse<TVeterinar>>;
}

export const ZivotinjaService: IZivotinjaService = {
    all: async (): Promise<TResponse<any>> => {
        const result = await AxiosFV.get(`/${ApiRoutesConstants.ZIVOTINJA}`);

        return {
            data: result.data,
            status: result.status
        };
    },
    byId: async (id: number): Promise<TResponse<any>> => {
        const result = await AxiosFV.get(`/${ApiRoutesConstants.ZIVOTINJA}/${id}`);

        return {
            data: result.data,
            status: result.status
        };
    },
    create: async (item: TVeterinar): Promise<TResponse<TVeterinar>> => {
        const result = await AxiosFV.post(`/${ApiRoutesConstants.ZIVOTINJA}`, item);

        return {
            data: result.data,
            status: result.status
        };
    },
    update: async (id: number, item: TVeterinar): Promise<TResponse<TVeterinar>> => {
        const result = await AxiosFV.put(`/${ApiRoutesConstants.ZIVOTINJA}/${id}`, item);

        return {
            data: result.data,
            status: result.status
        };
    },
    delete: async (id: number): Promise<TResponse<TVeterinar>> => {
        const result = await AxiosFV.delete(`/${ApiRoutesConstants.ZIVOTINJA}/${id}`);

        return {
            data: result.data,
            status: result.status
        };
    }
};