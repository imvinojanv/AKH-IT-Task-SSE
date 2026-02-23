import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchSavedProducts, saveProduct, removeSavedProduct } from '../api';

const SavedProductsContext = createContext();

export function SavedProductsProvider({ children }) {
    const [savedProducts, setSavedProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const refreshSaved = useCallback(async () => {
        try {
            const res = await fetchSavedProducts();
            setSavedProducts(res.data);
        } catch (err) {
            console.error('Failed to fetch saved products:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refreshSaved();
    }, [refreshSaved]);

    const toggleSave = async (product) => {
        const isSaved = savedProducts.some(p => p.product_id === product.id);

        setSavedProducts(prev => {
            if (isSaved) {
                return prev.filter(p => p.product_id !== product.id);
            } else {
                return [{ product_id: product.id, product }, ...prev];
            }
        });

        try {
            if (isSaved) {
                await removeSavedProduct(product.id);
            } else {
                await saveProduct(product.id);
            }
            refreshSaved(); // Sync with actual server state silently
        } catch (e) {
            console.error('Toggle save failed', e);
            refreshSaved(); // Revert back if it failed
        }
    };

    return (
        <SavedProductsContext.Provider value={{ savedProducts, loading, toggleSave, refreshSaved }}>
            {children}
        </SavedProductsContext.Provider>
    );
}

export function useSavedProducts() {
    const context = useContext(SavedProductsContext);
    if (context === undefined) {
        throw new Error('useSavedProducts must be used within a SavedProductsProvider');
    }
    return context;
}
