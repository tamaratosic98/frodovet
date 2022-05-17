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