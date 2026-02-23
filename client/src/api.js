export const getUserToken = () => {
    let token = localStorage.getItem('user_token');
    if (!token) {
        token = 'usr-' + Math.random().toString(36).substring(2, 10);
        localStorage.setItem('user_token', token);
    }
    return token;
};

export const fetchProducts = async (params = {}) => {
    const query = new URLSearchParams();

    // Handle all params mapping
    Object.keys(params).forEach(key => {
        const val = params[key];
        const cleanKey = key.endsWith('[]') ? key.slice(0, -2) : key;

        if (Array.isArray(val)) {
            val.forEach(v => query.append(`${cleanKey}[]`, v));
        } else if (val !== undefined && val !== null && val !== '') {
            query.append(cleanKey, val);
        }
    });

    const res = await fetch(`/api/products?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
};

export const fetchSavedProducts = async () => {
    const res = await fetch(`/api/saved`, {
        headers: { 'X-User-Token': getUserToken() }
    });
    if (!res.ok) throw new Error('Failed to fetch saved products');
    return res.json();
};

export const saveProduct = async (productId) => {
    const res = await fetch(`/api/saved`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-User-Token': getUserToken(),
            'Accept': 'application/json'
        },
        body: JSON.stringify({ product_id: productId })
    });
    if (!res.ok) throw new Error('Failed to save product');
    return res.json();
};

export const removeSavedProduct = async (productId) => {
    const res = await fetch(`/api/saved/${productId}`, {
        method: 'DELETE',
        headers: { 'X-User-Token': getUserToken() }
    });
    if (!res.ok) throw new Error('Failed to remove saved product');
    return res.json();
};
