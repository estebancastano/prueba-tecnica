"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth, type User } from "@/context/AuthContext"; // ← importamos User
import { Button } from "@/components/ui/button";

export default function CompleteProfile() {
    const { user, setUser } = useAuth();
    const router = useRouter();

    const [phone, setPhone] = useState(user?.phone || "");

    useEffect(() => {
        if (!user) {
            router.replace("/login");
        } else if (user.phone) {
            router.replace("/dashboard"); // si ya tiene teléfono, redirige
        }
    }, [user, router]);

    const handleSubmit = async () => {
        if (!user) return;

        try {
            const res = await fetch(`/api/users/${user.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: user.id, phone }),
            });

            if (!res.ok) throw new Error("Error al actualizar el perfil");

            const updatedUser: User = { ...user, phone };
            setUser(updatedUser);

            router.push("/dashboard");
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen gap-6">
            <h1 className="text-2xl font-bold">Completa tu perfil</h1>

            <input
                type="text"
                placeholder="Teléfono"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="input input-bordered w-80"
            />

            <Button onClick={handleSubmit}>Guardar</Button>
        </div>
    );
}
