import { AxiosFV } from "../../api/axios-helper";
import { TResponse } from "../../interfaces/common.interface";
import { TTermin } from "../../interfaces/models/Termin/termin.model";
import { ApiRoutesConstants } from "../../utils/contants";

interface ITerminService {
    all: () => Promise<TResponse<TTermin[]>>;
    byId?: (idVeterinara: string, idZivotinje: number, datum: Date) => Promise<TResponse<TTermin>>,
    create?: (item: TTermin) => Promise<TResponse<TTermin>>;
    update?: (idVeterinara: string, idZivotinje: number, datum: Date, item: TTermin) => Promise<TResponse<TTermin>>;
    delete?: (idVeterinara: string, idZivotinje: number, datum: Date) => Promise<TResponse<TTermin>>;
}

export const TerminService: ITerminService = {
    all: async (): Promise<TResponse<any>> => {
        const result = await AxiosFV.get(`/${ApiRoutesConstants.TERMIN}`);

        return {
            data: result.data,
            status: result.status
        };
    },
    byId: async (idVeterinara: string, idZivotinje: number, datum: Date): Promise<TResponse<any>> => {
        const result = await AxiosFV.get(`/${ApiRoutesConstants.TERMIN}/${idZivotinje}/${idVeterinara}/${datum}`);

        return {
            data: result.data,
            status: result.status
        };
    },
    create: async (item: TTermin): Promise<TResponse<TTermin>> => {
        const result = await AxiosFV.post(`/${ApiRoutesConstants.TERMIN}`, item);

        return {
            data: result.data,
            status: result.status
        };
    },
    update: async (idVeterinara: string, idZivotinje: number, datum: Date, item: TTermin): Promise<TResponse<TTermin>> => {
        const result = await AxiosFV.put(`/${ApiRoutesConstants.TERMIN}/${idZivotinje}/${idVeterinara}/${datum}`, item);

        return {
            data: result.data,
            status: result.status
        };
    },
    delete: async (idVeterinara: string, idZivotinje: number, datum: Date,): Promise<TResponse<TTermin>> => {
        const result = await AxiosFV.delete(`/${ApiRoutesConstants.TERMIN}/${idZivotinje}/${idVeterinara}/${datum}`);

        return {
            data: result.data,
            status: result.status
        };
    }
};