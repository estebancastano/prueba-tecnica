// context/AuthContext.tsx
import { createContext, useContext, useState, ReactNode, useEffect } from "react";

type User = { id: string; name: string; email: string; role: "ADMIN" | "USUARIO" };

type AuthContextType = { user: User | null; setUser: (u: User | null) => void };

const AuthContext = createContext<AuthContextType>({ user: null, setUser: () => { } });

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const baseOrigin =
            typeof window !== "undefined"
                ? window.location.origin
                : process.env.NEXT_PUBLIC_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

        fetch(`${baseOrigin}/api/auth/me`, {
            credentials: "include", // <- MUY IMPORTANTE
        })
            .then(async (res) => {
                if (!res.ok) throw new Error("No autenticado");
                const data = await res.json();
                setUser(data.user ?? null);
            })
            .catch(() => setUser(null));
    }, []);

    return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
