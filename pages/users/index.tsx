import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SquarePen } from "lucide-react";

type User = {
    id: number;
    name: string;
    email: string;
    role: string;
    phone: string;
};

export default function Users() {
    const { user } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch("/api/users");
            const data = await res.json();
            setUsers(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!selectedUser) return;
        setSelectedUser({ ...selectedUser, [e.target.name]: e.target.value });
    };

    const handleRoleChange = (role: string) => {
        if (!selectedUser) return;
        setSelectedUser({ ...selectedUser, role });
    };

    const handleSubmit = async () => {
        if (!selectedUser) return;
        try {
            const res = await fetch(`/api/users/${selectedUser.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(selectedUser),
            });
            if (!res.ok) throw new Error("Error al actualizar usuario");
            setIsDialogOpen(false);
            fetchUsers();
        } catch (err) {
            console.error(err);
        }
    };

    if (!user || user.role !== "ADMIN") return <div>No autorizado</div>;

    return (
        <Layout>
            <h2 className="text-2xl font-bold mb-4">Gestión de Usuarios</h2>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-100">
                            <TableHead>Nombre</TableHead>
                            <TableHead>Correo</TableHead>
                            <TableHead>Teléfono</TableHead>
                            <TableHead>Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((u) => (
                            <TableRow key={u.id} className="hover:bg-gray-50">
                                <TableCell>{u.name}</TableCell>
                                <TableCell>{u.email}</TableCell>
                                <TableCell>{u.phone}</TableCell>
                                <TableCell>
                                    <Button
                                        size="sm"
                                        onClick={() => {
                                            setSelectedUser(u);
                                            setIsDialogOpen(true);
                                        }}
                                    >
                                        <SquarePen />
                                        Editar
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Dialog de edición */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Editar Usuario</DialogTitle>
                    </DialogHeader>

                    {selectedUser && (
                        <div className="grid gap-4 py-2">
                            <div className="grid gap-1">
                                <Label htmlFor="name">Nombre</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    value={selectedUser.name}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="grid gap-1">
                                <Label htmlFor="role">Rol</Label>
                                <Select
                                    value={selectedUser.role}
                                    onValueChange={handleRoleChange}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona un rol" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ADMIN">ADMIN</SelectItem>
                                        <SelectItem value="USUARIO">USUARIO</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button onClick={handleSubmit}>Guardar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Layout>
    );
}
