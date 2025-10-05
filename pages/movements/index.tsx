// pages/movimientos.tsx
import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, CirclePlus } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Movimiento = {
    id: number;
    concepto: string;
    monto: number;
    fecha: string;
    usuario: {
        name: string;
    };
};

export default function Movimientos() {
    const { user } = useAuth();

    const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
    const [total, setTotal] = useState(0);
    const [totalGlobal, setTotalGlobal] = useState(0);
    const [page, setPage] = useState(1);
    const limit = 5;

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [form, setForm] = useState({
        concepto: "",
        monto: 0,
        fecha: "",
    });

    useEffect(() => {
        fetchMovimientos(page);
    }, [page]);

    const fetchMovimientos = async (pageNumber: number = 1) => {
        try {
            const res = await fetch(`/api/movements?page=${pageNumber}&limit=${limit}`);
            const data = await res.json();
            setMovimientos(data.movimientos);
            setTotal(data.total);
            setTotalGlobal(data.totalGlobal);
        } catch (err) {
            console.error(err);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        if (!form.concepto || !form.monto || !form.fecha) return;

        try {
            // Enviamos la fecha como string YYYY-MM-DD para evitar desfase
            await fetch("/api/movements", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            setIsDialogOpen(false);
            setForm({ concepto: "", monto: 0, fecha: "" });
            fetchMovimientos(page);
        } catch (err) {
            console.error(err);
        }
    };

    const totalSuma = movimientos.reduce((acc, mov) => acc + mov.monto, 0);

    return (
        <Layout>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Sistema de Gestión de Ingresos y Gastos</h2>
                {user && <Button onClick={() => setIsDialogOpen(true)}> <CirclePlus /> Nuevo</Button>}
            </div>

            {/* Tabla de movimientos */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-100">
                            <TableHead>Concepto</TableHead>
                            <TableHead>Monto</TableHead>
                            <TableHead>Fecha</TableHead>
                            <TableHead>Usuario</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {movimientos.map((mov) => (
                            <TableRow key={mov.id} className="hover:bg-gray-50">
                                <TableCell>{mov.concepto}</TableCell>
                                <TableCell className={mov.monto < 0 ? "text-red-500" : "text-green-600"}>
                                    {mov.monto.toLocaleString("es-CO", { style: "currency", currency: "COP" })}
                                </TableCell>
                                {/* Fecha formateada a DD/MM/YYYY */}
                                <TableCell>
                                    {mov.fecha.split("T")[0].split("-").reverse().join("/")}
                                </TableCell>

                                <TableCell>{mov.usuario.name}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {/* Total */}
                <div className="flex justify-end p-4 font-semibold text-lg">
                    Total global:{" "}
                    <span
                        className={totalGlobal < 0 ? "text-red-500" : "text-green-600"}
                        style={{ marginLeft: 8 }}
                    >
                        {totalGlobal.toLocaleString("es-CO", { style: "currency", currency: "COP" })}
                    </span>
                </div>

                {/* Paginación */}
                <div className="flex justify-between items-center p-4">
                    <Button
                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                        disabled={page === 1}
                        size="sm"
                    >
                        <ArrowLeft/>
                        Anterior
                    </Button>

                    <span>
                        Página {page} de {Math.ceil(total / limit)}
                    </span>

                    <Button
                        onClick={() => setPage((prev) => Math.min(prev + 1, Math.ceil(total / limit)))}
                        disabled={page >= Math.ceil(total / limit)}
                        size="sm"
                    >
                        <ArrowRight />
                        Siguiente
                    </Button>
                </div>
            </div>

            {/* Dialog para nuevo movimiento */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Nuevo Movimiento</DialogTitle>
                    </DialogHeader>

                    <div className="grid gap-4 py-2">
                        <div className="grid gap-1">
                            <Label htmlFor="concepto">Concepto</Label>
                            <Input id="concepto" name="concepto" value={form.concepto} onChange={handleChange} />
                        </div>

                        <div className="grid gap-1">
                            <Label htmlFor="monto">Monto</Label>
                            <Input id="monto" name="monto" type="number" value={form.monto} onChange={handleChange} />
                        </div>

                        <div className="grid gap-1">
                            <Label htmlFor="fecha">Fecha</Label>
                            <Input id="fecha" name="fecha" type="date" value={form.fecha} onChange={handleChange} />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button onClick={handleSubmit}>Guardar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Layout>
    );
}
