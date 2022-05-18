import { useCallback, useEffect, useMemo, useState } from "react";
import { TRasa } from "../../interfaces/models/Rasa/rasa.model";
import { RasaService } from "../../services/Rasa/rasa.service";

export const useRase = () => {
    const [items, setItems] = useState<TRasa[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>();

    const loadItems = useCallback(async () => {
        setIsLoading(true);
        try {
            const result = await RasaService.all();

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

export const useRasa = (id: number) => {
    const [item, setItem] = useState<TRasa>({});
    const [isLoading, setIsLoading] = useState<boolean>();

    const loadItem = useCallback(async () => {
        setIsLoading(true);
        try {
            const result = await RasaService.byId(id);

            setItem(result.data);
        } catch (err) {
            console.error(err);
        }

        setIsLoading(false);
    }, []);

    useEffect(() => {
        loadItem();
    }, [id]);

    return useMemo(() => ({
        item,
        isLoading,
        loadItem
    }), [item, isLoading, loadItem]);
};

export const useCudRasa = () => {
    const [item, setItem] = useState<TRasa>({});
    const [isLoading, setIsLoading] = useState<boolean>();

    const createItem = useCallback(async (item: TRasa) => {
        setIsLoading(true);
        try {
            const result = await RasaService.create(item);

            setItem(result.data);
        } catch (err) {
            console.error(err);
        }

        setIsLoading(false);
    }, []);

    const deleteItem = useCallback(async (id: number) => {
        setIsLoading(true);
        try {
            const result = await RasaService.delete(id);

            setItem(result.data);
        } catch (err) {
            console.error(err);
        }

        setIsLoading(false);
    }, []);

    const updateItem = useCallback(async (id: number, item: TRasa) => {
        setIsLoading(true);
        try {
            const result = await RasaService.update(id, item);

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

