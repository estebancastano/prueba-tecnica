"use client";

import { signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function LoginPage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGitHubLogin = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log("🔄 Iniciando proceso de login...");

            await signIn.social({
                provider: "github",
                callbackURL: "/",
            });

            console.log("✅ Redirigiendo a GitHub...");
        } catch (err) {
            console.error("❌ Error:", err);
            setError(err instanceof Error ? err.message : "Error desconocido");
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <h1 className="text-3xl font-bold mb-2">Bienvenido</h1>
                <p className="text-gray-600 mb-6">Inicia sesión para continuar</p>

                <Button
                    onClick={handleGitHubLogin}
                    disabled={loading}
                    className="w-full"
                >
                    {loading ? "Cargando..." : "Iniciar sesión con GitHub"}
                </Button>

                {error && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
}