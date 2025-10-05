"use client";

import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";

export default function Home() {
    const router = useRouter();
    const { data: session, isPending } = useSession();

    useEffect(() => {
        if (isPending) return; // todavía cargando

        if (session?.session) {
            router.replace("/dashboard");
        } else {
            router.replace("/login");
        }
    }, [session, isPending, router]);

    return (
        <div className="flex flex-col items-center justify-center h-screen space-y-4">
            <Loader2 className="animate-spin w-12 h-12 text-primary" />
            <p className="text-gray-600 text-lg">Redirigiendo...</p>
        </div>
    );
}
