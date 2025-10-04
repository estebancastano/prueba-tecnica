import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { ChartColumnBig, FileDown } from 'lucide-react';
import {
    Bar,
    BarChart,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

type Usuario = {
    name: string;
};

type Movimiento = {
    id: number;
    concepto: string;
    monto: number;
    fecha: string;
    usuario?: Usuario;
};

export default function Reports() {
    const { user } = useAuth();
    const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
    const [saldo, setSaldo] = useState(0);

    useEffect(() => {
        if (user) fetchMovimientos();
    }, [user]);

    const fetchMovimientos = async () => {
        try {
            const fechaFin = new Date();
            const fechaInicio = new Date();
            fechaInicio.setDate(fechaFin.getDate() - 30);

            const res = await fetch(
                `/api/movements?fechaInicio=${fechaInicio.toISOString()}&fechaFin=${fechaFin.toISOString()}`
            );
            const data = await res.json();

            const movimientosArray: Movimiento[] = Array.isArray(data)
                ? data
                : data.movimientos || [];

            setMovimientos(movimientosArray);

            // 💰 Calcular saldo total
            const total = movimientosArray.reduce(
                (acc, mov) => acc + Number(mov.monto),
                0
            );
            setSaldo(total);
        } catch (err) {
            console.error(err);
        }
    };

    // 📊 Crear mapa con los últimos 30 días
    const generarRangoFechas = () => {
        const fechas: Record<string, number> = {};
        const hoy = new Date();
        for (let i = 30; i >= 0; i--) {
            const fecha = new Date();
            fecha.setDate(hoy.getDate() - i);
            const key = fecha.toISOString().split("T")[0];
            fechas[key] = 0;
        }
        return fechas;
    };

    // 📊 Agrupar montos por fecha usando formato UTC estable
    const chartData = (() => {
        const mapaFechas = generarRangoFechas();
        movimientos.forEach((mov) => {
            const fechaKey = new Date(mov.fecha).toISOString().split("T")[0];
            if (mapaFechas[fechaKey] !== undefined) {
                mapaFechas[fechaKey] += Number(mov.monto);
            }
        });

        return Object.entries(mapaFechas).map(([fecha, monto]) => ({
            fecha,
            monto,
        }));
    })();

    // 📈 Promedio diario
    const promedioDiario = chartData.length ? saldo / chartData.length : 0;

    // 📥 Descargar CSV con nombre del usuario y todos los registros
    const handleDownloadCSV = async () => {
        const res = await fetch("/api/movements?all=true");
        const data = await res.json();

        const csvContent =
            "\uFEFF" + // ← 📌 BOM para compatibilidad con Excel y caracteres especiales
            [
                ["Fecha", "Monto", "Concepto", "Usuario"],
                ...data.movimientos.map((m) => [
                    m.fecha.split("T")[0],
                    m.monto,
                    m.concepto,
                    m.usuario.name,
                ]),
            ]
                .map((row) => row.join(","))
                .join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "reporte_movimientos.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (!user || user.role !== "ADMIN") return <div>No autorizado</div>;

    return (
        <Layout>
            <div className="flex items-center gap-3 mb-6">
                <ChartColumnBig className="text-2xl font-bold mb-4" />
                <h2 className="text-2xl font-bold mb-4"> Reportes de Movimientos</h2>
            </div>

            {/* 💰 Saldo actual y botón de descarga */}
            <div className="mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                    <p className="text-lg font-semibold">
                        Saldo actual:{" "}
                        <span className={saldo < 0 ? "text-red-500" : "text-green-600"}>
                            {saldo.toLocaleString("es-CO", {
                                style: "currency",
                                currency: "COP",
                            })}
                        </span>
                    </p>
                    <p className="text-md mt-1 text-gray-700">
                        Promedio diario:{" "}
                        <span className="font-semibold text-blue-600">
                            {promedioDiario.toLocaleString("es-CO", {
                                style: "currency",
                                currency: "COP",
                            })}
                        </span>
                    </p>
                </div>

                <Button onClick={handleDownloadCSV} className="px-6">
                    <FileDown  /> Descargar CSV
                </Button>
            </div>

            {/* 📈 Gráfico */}
            <div className="bg-white shadow-md rounded-lg p-4">
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart
                        data={chartData}
                        margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="fecha" angle={-45} textAnchor="end" height={70} />
                        <YAxis />
                        <Tooltip
                            formatter={(value: number) =>
                                value.toLocaleString("es-CO", {
                                    style: "currency",
                                    currency: "COP",
                                })
                            }
                        />
                        <Bar
                            dataKey="monto"
                            fill="#4F46E5"
                            barSize={15}
                            radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </Layout>
    );
}
