import { useCallback, useEffect, useMemo, useState } from "react";
import { TLokacija } from "../../interfaces/models/Lokacija/lokacija.model";
import { LokacijaService } from "../../services/Lokacija/lokacija.service";

export const useLokacije = () => {
    const [items, setItems] = useState<TLokacija[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>();

    const loadItems = useCallback(async () => {
        setIsLoading(true);
        try {
            const result = await LokacijaService.all();

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

export const useLokacija = (id: number) => {
    const [item, setItem] = useState<TLokacija>({});
    const [isLoading, setIsLoading] = useState<boolean>();

    const loadItem = useCallback(async () => {
        setIsLoading(true);
        try {
            const result = await LokacijaService.byId(id);

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

export const useCudLokacija = () => {
    const [item, setItem] = useState<TLokacija>({});
    const [isLoading, setIsLoading] = useState<boolean>();

    const createItem = useCallback(async (item: TLokacija) => {
        setIsLoading(true);
        try {
            const result = await LokacijaService.create(item);

            setItem(result.data);
        } catch (err) {
            console.error(err);
        }

        setIsLoading(false);
    }, []);

    const deleteItem = useCallback(async (id: number) => {
        setIsLoading(true);
        try {
            const result = await LokacijaService.delete(id);

            setItem(result.data);
        } catch (err) {
            console.error(err);
        }

        setIsLoading(false);
    }, []);

    const updateItem = useCallback(async (id: number, item: TLokacija) => {
        setIsLoading(true);
        try {
            const result = await LokacijaService.update(id, item);

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

