import { ReactNode, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import {
    SidebarProvider,
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarFooter,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from "@/components/ui/sidebar";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import { LogOut, Wallet, Users, FileText } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";

interface LayoutProps {
    children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
    const { user, setUser } = useAuth();
    const router = useRouter();
    const [open, setOpen] = useState(false); // estado del modal

    const handleLogout = async () => {
        try {
            await authClient.signOut();
            setUser(null);
            setOpen(true); // abrir modal después de cerrar sesión
        } catch (err) {
            console.error("Error al cerrar sesión:", err);
        }
    };

    return (
        <SidebarProvider>
            <div className="flex h-screen">
                {/* 🧭 Sidebar */}
                <Sidebar className="sidebar-theme border-r">
                    <SidebarContent>
                        <SidebarHeader className="flex items-center justify-center py-6">
                            <Link href="/dashboard" passHref>
                                <Image
                                    src="/logo.png"
                                    alt="Logo del sistema"
                                    width={140}
                                    height={50}
                                    priority
                                    className="object-contain cursor-pointer hover:scale-105 transition-transform duration-200 rounded-lg"
                                />
                            </Link>
                        </SidebarHeader>

                        <SidebarMenu>
                            <SidebarMenuItem>
                                <Link href="/movements" passHref>
                                    <SidebarMenuButton>
                                        <Wallet className="mr-2 text-lg" /> Ingresos y egresos
                                    </SidebarMenuButton>
                                </Link>
                            </SidebarMenuItem>

                            {user?.role === "ADMIN" && (
                                <>
                                    <SidebarMenuItem>
                                        <Link href="/users" passHref>
                                            <SidebarMenuButton>
                                                <Users className="mr-2" /> Usuarios
                                            </SidebarMenuButton>
                                        </Link>
                                    </SidebarMenuItem>

                                    <SidebarMenuItem>
                                        <Link href="/reports" passHref>
                                            <SidebarMenuButton>
                                                <FileText className="mr-2" /> Reportes
                                            </SidebarMenuButton>
                                        </Link>
                                    </SidebarMenuItem>
                                </>
                            )}
                        </SidebarMenu>

                        <SidebarFooter className="flex flex-col gap-3 mt-auto px-4 pb-6">
                            <span className="text-sm text-muted-foreground truncate">
                                Usuario: {user?.name}
                            </span>

                            {user && (
                                <Button
                                    variant="destructive"
                                    className="w-full"
                                    onClick={handleLogout}
                                >
                                    <LogOut />
                                    Cerrar Sesión
                                </Button>
                            )}
                        </SidebarFooter>
                    </SidebarContent>
                </Sidebar>

                {/* 📄 Contenido principal */}
                <main className="flex-1 overflow-auto bg-background p-6">
                    {children}
                </main>

                {/* 🔐 Modal de sesión cerrada */}
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogContent className="max-w-sm text-center">
                        <DialogHeader>
                            <DialogTitle className="text-xl">🔐 Sesión cerrada</DialogTitle>
                            <DialogDescription className="text-gray-600 mt-2">
                                Has cerrado sesión en la aplicación correctamente.
                                Si deseas iniciar sesión con otra cuenta de <strong>GitHub</strong>,
                                cierra sesión también en GitHub o abre esta página en modo incógnito.
                            </DialogDescription>
                        </DialogHeader>

                        <DialogFooter className="flex justify-center gap-3 mt-4">
                            <Button asChild variant="outline">
                                <a
                                    href="https://github.com/logout"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Cerrar sesión en GitHub
                                </a>
                            </Button>
                            <Button onClick={() => {
                                setOpen(false);
                                router.push("/login"); // redirige al login al cerrar el modal
                            }}>
                                Entendido
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </SidebarProvider>
    );
}
