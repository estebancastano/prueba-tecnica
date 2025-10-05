import { createMocks } from 'node-mocks-http';
import handler from '../movements/index';
import { NextApiRequest, NextApiResponse } from 'next';

// --- Mock de lib/auth.ts ---
jest.mock('@/lib/auth', () => ({
  auth: {
    requireAdmin: jest.fn((handler) => handler), // solo pasa el handler
  },
}));

// --- Mock de lib/authMiddleware.ts ---
jest.mock('@/lib/authMiddleware', () => ({
  withAuth: jest.fn((handler) => async (req: any, res: any) => {
    // simula que siempre hay un usuario ADMIN
    req.user = { id: 1, name: 'Admin', role: 'ADMIN' };
    return handler(req, res);
  }),
}));

// --- Mock de lib/prisma ---
jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: {
    movimiento: {
      create: jest.fn().mockResolvedValue({
        id: 1,
        concepto: 'Ingreso prueba',
        monto: 500,
        fecha: '2025-10-04',
        usuario: { name: 'Admin' },
      }),
      findMany: jest.fn().mockResolvedValue([
        {
          id: 1,
          concepto: 'Ingreso prueba',
          monto: 500,
          fecha: '2025-10-04',
          usuario: { name: 'Admin' },
        },
      ]),
      count: jest.fn().mockResolvedValue(1),
      aggregate: jest.fn().mockResolvedValue({
        _sum: { monto: 500 },
      }),
    },
  },
}));

// --- Tests ---
describe('API Movements', () => {
  it('debería crear un nuevo movimiento', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        monto: 500,
        concepto: 'Ingreso prueba',
        fecha: '2025-10-04',
      },
    });

    await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

    expect(res._getStatusCode()).toBe(201);
    const data = JSON.parse(res._getData());
    expect(data).toHaveProperty('id');
    expect(data.concepto).toBe('Ingreso prueba');
    expect(data.monto).toBe(500);
  });

  it('debería devolver una lista de movimientos', async () => {
    const { req, res } = createMocks({ method: 'GET' });

    await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    expect(Array.isArray(data.movimientos)).toBe(true);
    expect(data.movimientos.length).toBeGreaterThanOrEqual(1);
  });

  it('debería rechazar acceso sin autenticación', async () => {
    // Mock temporal de withAuth que fuerza req.user = null
    jest.isolateModules(() => {
      jest.resetModules(); // limpia todos los mocks
      jest.doMock('@/lib/authMiddleware', () => ({
        withAuth: (handler: any) => async (req: any, res: any) => {
          req.user = null; // sin usuario
          return handler(req, res);
        },
      }));

      const { createMocks } = require('node-mocks-http');
      const handlerTest = require('../movements/index').default;

      const { req, res } = createMocks({ method: 'GET' });

      return handlerTest(req, res).then(() => {
        expect(res._getStatusCode()).toBe(401);
        const data = JSON.parse(res._getData());
        expect(data).toHaveProperty('message');
      });
    });
  });
});
