import { useCallback, useEffect, useMemo, useState } from "react";
import { TKorisnik } from "../../interfaces/models/Korisnik/korisnik.model";
import { KorisnikService } from "../../services/Korisnik/korisnik.service";

export const useKorisnici = () => {
    const [items, setItems] = useState<TKorisnik[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>();

    const loadItems = useCallback(async () => {
        setIsLoading(true);
        try {
            const result = await KorisnikService.all();

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

export const useKorisnk = (id: number) => {
    const [item, setItem] = useState<TKorisnik>({});
    const [isLoading, setIsLoading] = useState<boolean>();

    const loadItem = useCallback(async () => {
        setIsLoading(true);
        try {
            const result = await KorisnikService.byId(id);

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

export const useCudKorisnk = () => {
    const [item, setItem] = useState<TKorisnik>({});
    const [isLoading, setIsLoading] = useState<boolean>();

    const createItem = useCallback(async (item: TKorisnik) => {
        setIsLoading(true);
        try {
            const result = await KorisnikService.create(item);

            setItem(result.data);
        } catch (err) {
            console.error(err);
        }

        setIsLoading(false);
    }, []);

    const deleteItem = useCallback(async (id: number) => {
        setIsLoading(true);
        try {
            const result = await KorisnikService.delete(id);

            setItem(result.data);
        } catch (err) {
            console.error(err);
        }

        setIsLoading(false);
    }, []);

    const updateItem = useCallback(async (id: number, item: TKorisnik) => {
        setIsLoading(true);
        try {
            const result = await KorisnikService.update(id, item);

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

