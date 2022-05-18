import { useCallback, useEffect, useMemo, useState } from "react";
import { TZivotinja } from "../../interfaces/models/Zivotinja/zivotinja.model";
import { ZivotinjaService } from "../../services/Zivotinja/zivotinja.service";

export const useZivotinje = () => {
    const [items, setItems] = useState<TZivotinja[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>();

    const loadItems = useCallback(async () => {
        setIsLoading(true);
        try {
            const result = await ZivotinjaService.all();

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

export const useZivotinja = (id: number) => {
    const [item, setItem] = useState<TZivotinja>({});
    const [isLoading, setIsLoading] = useState<boolean>();

    const loadItem = useCallback(async () => {
        setIsLoading(true);
        try {
            const result = await ZivotinjaService.byId(id);

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

export const useCudZivotinja = () => {
    const [item, setItem] = useState<TZivotinja>({});
    const [isLoading, setIsLoading] = useState<boolean>();

    const createItem = useCallback(async (item: TZivotinja) => {
        setIsLoading(true);
        try {
            const result = await ZivotinjaService.create(item);

            setItem(result.data);
        } catch (err) {
            console.error(err);
        }

        setIsLoading(false);
    }, []);

    const deleteItem = useCallback(async (id: number) => {
        setIsLoading(true);
        try {
            const result = await ZivotinjaService.delete(id);

            setItem(result.data);
        } catch (err) {
            console.error(err);
        }

        setIsLoading(false);
    }, []);

    const updateItem = useCallback(async (id: number, item: TZivotinja) => {
        setIsLoading(true);
        try {
            const result = await ZivotinjaService.update(id, item);

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

