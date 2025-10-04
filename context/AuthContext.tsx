import { createContext, useContext, useState, ReactNode, useEffect } from "react";

type User = {
    id: string;
    name: string;
    email: string;
    role: "ADMIN" | "USUARIO";
};

type AuthContextType = {
    user: User | null;
    setUser: (user: User | null) => void;
};

const AuthContext = createContext<AuthContextType>({ user: null, setUser: () => { } });

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    // Se hace esto para traer el usuario autenticado al cargar la app
    useEffect(() => {
        fetch("/api/auth/me") 
            .then(res => res.json())
            .then(data => setUser(data.user))
            .catch(() => setUser(null));
    }, []);

    return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
