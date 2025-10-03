import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testDB() {
    // Crear un usuario de prueba
    const user = await prisma.user.create({
        data: {
            name: "Usuario prueba",
            email: "test@example.com",
            phone: "123456789",
            role: "ADMIN",
        },
    });

    // Crear un movimiento
    const movimiento = await prisma.movimiento.create({
        data: {
            concepto: "Ingreso inicial",
            monto: 1000.0,
            tipo: "INGRESO",
            userId: user.id,
        },
    });

    console.log("✅ Usuario creado:", user);
    console.log("✅ Movimiento creado:", movimiento);
}

testDB()
    .catch((e) => console.error("❌ Error:", e))
    .finally(async () => {
        await prisma.$disconnect();
    });
