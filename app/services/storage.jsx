export const saveToStorage = (items) => {
    Object.keys(items).forEach(key => {
      localStorage.setItem(key, JSON.stringify(items[key]));
    });
};

export const getFromStorage = (key) => {
    if (key) {
        const value = localStorage.getItem(key);
        if (!value) return null;
        try {
            return JSON.parse(value);
        } catch {
            return value;
        }
    }
    return null;
};

export const removeFromStorage = (...keys) => {
    if (keys.length > 0) {
        keys.forEach(key => localStorage.removeItem(key));
    } else {
        localStorage.clear();
    }
};

export const getToken = () => {
    return getFromStorage('token');
};

export const isAuthenticated = () => {
    return !!localStorage.getItem("token")
}
  
export const getImage = () => {
    return getFromStorage('image');
};