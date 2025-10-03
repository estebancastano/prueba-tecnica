"use client";
import { Button } from "@/components/ui/button";

export default function Home() {
    return (
        <main className="p-4">
            <Button
                onClick={() =>
                (window.location.href =
                    "/api/auth/sign-in/social?provider=github")
                }
            >
                Iniciar sesión con GitHub
            </Button>
        </main>
    );
}
