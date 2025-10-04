"use client";
import { Button } from "@/components/ui/button";

export default function Home() {
    const baseUrl = process.env.NEXT_PUBLIC_AUTH_URL;

    return (
        <main className="p-4">
            <Button
                onClick={() =>
                    (window.location.href = `${baseUrl}/api/auth/sign-in/social?provider=github`)
                }
            >
                Iniciar sesión con GitHub
            </Button>
        </main>
    );
}
