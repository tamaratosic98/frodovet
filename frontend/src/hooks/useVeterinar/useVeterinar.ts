import { useCallback, useEffect, useMemo, useState } from "react";
import { TVeterinar } from "../../interfaces/models/Veterinar/veterinar.model";
import { VeterinarService } from "../../services/Veterinar/veterinar.service";

export const useVeterinari = () => {
    const [items, setItems] = useState<TVeterinar[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>();

    const loadItems = useCallback(async () => {
        setIsLoading(true);
        try {
            const result = await VeterinarService.all();

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

export const useVeterinar = (id: string) => {
    const [item, setItem] = useState<TVeterinar>({});
    const [isLoading, setIsLoading] = useState<boolean>();

    const loadItem = useCallback(async () => {
        setIsLoading(true);
        try {
            const result = await VeterinarService.byId(id);

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

export const useCudVeterinar = () => {
    const [item, setItem] = useState<TVeterinar>({});
    const [isLoading, setIsLoading] = useState<boolean>();

    const createItem = useCallback(async (item: TVeterinar) => {
        setIsLoading(true);
        try {
            const result = await VeterinarService.create(item);

            setItem(result.data);
        } catch (err) {
            console.error(err);
        }

        setIsLoading(false);
    }, []);

    const deleteItem = useCallback(async (id: string) => {
        setIsLoading(true);
        try {
            const result = await VeterinarService.delete(id);

            setItem(result.data);
        } catch (err) {
            console.error(err);
        }

        setIsLoading(false);
    }, []);

    const updateItem = useCallback(async (id: string, item: TVeterinar) => {
        setIsLoading(true);
        try {
            const result = await VeterinarService.update(id, item);

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

