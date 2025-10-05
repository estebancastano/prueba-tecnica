// pages/index.tsx
"use client";
import { useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext"; // ← importa el contexto

export default function Home() {
    const router = useRouter();
    const { user } = useAuth(); // ← obtiene el usuario actual
    useEffect(() => {
        if (user?.id) {
            router.replace("/dashboard"); 
        }
    }, [user, router]);

    return (
        <Layout>
            <div className="flex flex-col items-center justify-center h-full text-center">
                <h1 className="text-3xl font-bold mb-4">Bienvenido al Sistema Financiero</h1>
                <p className="text-gray-600 mb-12 text-lg">
                    Aquí puedes gestionar movimientos, usuarios y reportes.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
                    {/* Botón Movimientos */}
                    <Button
                        onClick={() => router.push("/movements")}
                        className="h-32 text-lg font-semibold shadow-lg rounded-2xl transition-transform hover:scale-105 text-center break-words whitespace-normal px-4"
                        variant="secondary"
                    >
                        Sistema de gestión de ingresos y gastos
                    </Button>

                    {/* Estos dos solo aparecen si el rol es ADMIN */}
                    {user?.role === "ADMIN" && (
                        <>
                            <Button
                                onClick={() => router.push("/users")}
                                className="h-32 text-lg font-semibold shadow-lg rounded-2xl transition-transform hover:scale-105"
                                variant="secondary"
                            >
                                Sistema de gestión de usuarios
                            </Button>

                            <Button
                                onClick={() => router.push("/reports")}
                                className="h-32 text-lg font-semibold shadow-lg rounded-2xl transition-transform hover:scale-105"
                                variant="secondary"
                            >
                                Reportes
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </Layout>
    );
}
