"use client";

import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "@/lib/auth-client";

export default function Home() {
    const router = useRouter();
    const { data: session, isPending } = useSession(); // 👈 cambia aquí

    useEffect(() => {
        if (isPending) return; // 👈 y aquí

        if (session?.session) {
            router.replace("/dashboard");
        } else {
            router.replace("/login");
        }
    }, [session, isPending, router]);

    return <p>Redirigiendo...</p>;
}
