import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
    const { user } = useAuth();

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Sistema Financiero</h1>
            <div className="flex gap-4">
                <Link href="/movimientos">
                    <button className="btn btn-primary">Movimientos</button>
                </Link>

                {/* Solo mostrar si el usuario es ADMIN */}
                {user?.role === "ADMIN" && (
                    <>
                        <Link href="/usuarios">
                            <button className="btn btn-secondary">Usuarios</button>
                        </Link>
                        <Link href="/reportes">
                            <button className="btn btn-accent">Reportes</button>
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
}
