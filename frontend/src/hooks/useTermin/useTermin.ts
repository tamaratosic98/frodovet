import { useCallback, useEffect, useMemo, useState } from "react";
import { TTermin } from "../../interfaces/models/Termin/termin.model";
import { TerminService } from "../../services/Termin/termin.service";

export const useTermini = () => {
    const [items, setItems] = useState<TTermin[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>();

    const loadItems = useCallback(async () => {
        setIsLoading(true);
        try {
            const result = await TerminService.all();

            setItems(result.data);
        } catch (err) {
            console.error(err);
        }

        setIsLoading(false);
    }, []);

    useEffect(() => {
        loadItems();
    }, [])

    return useMemo(() => ({
        items,
        isLoading,
        loadItems
    }), [items, isLoading, loadItems]);
};

export const useZivotinja = (idZivotinje: number, idVeterinara: string, datum: Date) => {
    const [item, setItem] = useState<TTermin>({});
    const [isLoading, setIsLoading] = useState<boolean>();

    const loadItem = useCallback(async () => {
        setIsLoading(true);
        try {
            const result = await TerminService.byId(idVeterinara, idZivotinje, datum);

            setItem(result.data);
        } catch (err) {
            console.error(err);
        }

        setIsLoading(false);
    }, []);

    useEffect(() => {
        loadItem();
    }, [idZivotinje, idVeterinara, datum]);

    return useMemo(() => ({
        item,
        isLoading,
        loadItem
    }), [item, isLoading, loadItem]);
};

export const useCudZivotinja = () => {
    const [item, setItem] = useState<TTermin>({});
    const [isLoading, setIsLoading] = useState<boolean>();

    const createItem = useCallback(async (item: TTermin) => {
        setIsLoading(true);
        try {
            const result = await TerminService.create(item);

            setItem(result.data);
        } catch (err) {
            console.error(err);
        }

        setIsLoading(false);
    }, []);

    const deleteItem = useCallback(async (idZivotinje: number, idVeterinara: string, datum: Date) => {
        setIsLoading(true);
        try {
            const result = await TerminService.delete(idVeterinara, idZivotinje, datum);

            setItem(result.data);
        } catch (err) {
            console.error(err);
        }

        setIsLoading(false);
    }, []);

    const updateItem = useCallback(async (idZivotinje: number, idVeterinara: string, datum: Date, item: TTermin) => {
        setIsLoading(true);
        try {
            const result = await TerminService.update(idVeterinara, idZivotinje, datum, item);

            setItem(result.data);
        } catch (err) {
            console.error(err);
        }

        setIsLoading(false);
    }, []);

    return useMemo(() => ({
        item,
        isLoading,
        createItem,
        deleteItem,
        updateItem
    }), [item, isLoading, createItem, deleteItem, updateItem]);
};

