"use client";
import { Button } from "@/components/ui/button";

export default function Home() {
    const base = typeof window !== "undefined" ? window.location.origin : process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:3000";
    const url = `${base.replace(/\/$/, "")}/api/auth/sign-in/social?provider=github`;

    return (
        <main className="p-4">
            <Button onClick={() => (window.location.href = url)}>Iniciar sesión con GitHub</Button>
        </main>
    );
}
