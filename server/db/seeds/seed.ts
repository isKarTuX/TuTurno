import { drizzle } from 'drizzle-orm/better-sqlite3'
import * as schema from '../schema'
import bcrypt from 'bcryptjs'

const db = drizzle('./tuturno.db', { schema })

async function seed() {
  console.log('Seeding database...')

  const passwordHash = await bcrypt.hash('TuTurno2024!', 12)

  console.log('Creating users...')
  const adminId = crypto.randomUUID()
  const operatorSuraId = crypto.randomUUID()
  const operatorBancolombiaId = crypto.randomUUID()
  const ciudadano1Id = crypto.randomUUID()
  const ciudadano2Id = crypto.randomUUID()
  const ciudadano3Id = crypto.randomUUID()

  await db.insert(schema.users).values([
    { id: adminId, fullName: 'Admin TuTurno', documentId: '12345678', email: 'admin@tuturno.co', phone: '3001234567', passwordHash, role: 'admin' },
    { id: operatorSuraId, fullName: 'Operador Sura', documentId: '23456789', email: 'operador@sura.co', phone: '3002345678', passwordHash, role: 'operator' },
    { id: operatorBancolombiaId, fullName: 'Operador Bancolombia', documentId: '34567890', email: 'operador@bancolombia.co', phone: '3003456789', passwordHash, role: 'operator' },
    { id: ciudadano1Id, fullName: 'Juan Pérez', documentId: '45678901', email: 'ciudadano1@test.com', phone: '3004567890', passwordHash, role: 'citizen' },
    { id: ciudadano2Id, fullName: 'María García', documentId: '56789012', email: 'ciudadano2@test.com', phone: '3005678901', passwordHash, role: 'citizen' },
    { id: ciudadano3Id, fullName: 'Carlos López', documentId: '67890123', email: 'ciudadano3@test.com', phone: '3006789012', passwordHash, role: 'citizen' },
  ])

  console.log('Creating entities...')
  const epsSuraId = crypto.randomUUID()
  const bancolombiaId = crypto.randomUUID()
  const secretariaId = crypto.randomUUID()

  await db.insert(schema.entities).values([
    { id: epsSuraId, name: 'EPS Sura Montería', type: 'eps', address: 'Calle 63 #14-45', city: 'Montería', phone: '6051234567', email: 'sura@eps.gov.co', latitude: 8.7555, longitude: -75.8815 },
    { id: bancolombiaId, name: 'Bancolombia Montería', type: 'bank', address: 'Carrera 3 #25-48', city: 'Montería', phone: '6057894567', email: 'monterioria@bancolombia.com', latitude: 8.7514, longitude: -75.8819 },
    { id: secretariaId, name: 'Secretaría de Hacienda de Montería', type: 'public_office', address: 'Calle 30 #15-32', city: 'Montería', phone: '6054567890', email: 'hacienda@monteria.gov.co', latitude: 8.7498, longitude: -75.8788 },
  ])

  console.log('Creating services...')
  const serviceAfiliacionesId = crypto.randomUUID()
  const serviceUrgenciasId = crypto.randomUUID()
  const serviceLaboratorioId = crypto.randomUUID()
  const serviceCuentasId = crypto.randomUUID()
  const serviceCreditosId = crypto.randomUUID()
  const serviceSegurosId = crypto.randomUUID()
  const serviceDeclaracionesId = crypto.randomUUID()
  const servicePagosId = crypto.randomUUID()
  const serviceCertificadosId = crypto.randomUUID()

  await db.insert(schema.services).values([
    { id: serviceAfiliacionesId, entityId: epsSuraId, name: 'Afiliaciones', description: 'Afiliación y desafiliación al sistema de salud', avgAttentionTime: 10, openTime: '07:00', closeTime: '17:00' },
    { id: serviceUrgenciasId, entityId: epsSuraId, name: 'Urgencias', description: 'Atención de emergencias y urgencias', avgAttentionTime: 15, openTime: '00:00', closeTime: '23:59' },
    { id: serviceLaboratorioId, entityId: epsSuraId, name: 'Laboratorio', description: 'Toma de muestras y exámenes de laboratorio', avgAttentionTime: 8, openTime: '06:00', closeTime: '16:00' },
    { id: serviceCuentasId, entityId: bancolombiaId, name: 'Cuentas y Transfers', description: 'Apertura de cuentas y transferencias', avgAttentionTime: 12, openTime: '08:00', closeTime: '16:00' },
    { id: serviceCreditosId, entityId: bancolombiaId, name: 'Créditos', description: 'Solicitud y gestión de créditos', avgAttentionTime: 20, openTime: '08:00', closeTime: '15:00' },
    { id: serviceSegurosId, entityId: bancolombiaId, name: 'Seguros', description: 'Contratación y gestión de seguros', avgAttentionTime: 15, openTime: '08:00', closeTime: '16:00' },
    { id: serviceDeclaracionesId, entityId: secretariaId, name: 'Declaraciones', description: 'Declaración de renta y otros impuestos', avgAttentionTime: 15, openTime: '08:00', closeTime: '17:00' },
    { id: servicePagosId, entityId: secretariaId, name: 'Pagos', description: 'Pago de impuestos y obligaciones', avgAttentionTime: 5, openTime: '08:00', closeTime: '17:00' },
    { id: serviceCertificadosId, entityId: secretariaId, name: 'Certificados', description: 'Solicitud de certificados y constancias', avgAttentionTime: 8, openTime: '08:00', closeTime: '17:00' },
  ])

  console.log('Creating operators...')
  await db.insert(schema.operators).values([
    { id: crypto.randomUUID(), userId: operatorSuraId, serviceId: serviceAfiliacionesId, entityId: epsSuraId },
    { id: crypto.randomUUID(), userId: operatorBancolombiaId, serviceId: serviceCuentasId, entityId: bancolombiaId },
  ])

  console.log('Creating turns...')
  const now = new Date()
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)

  await db.insert(schema.turns).values([
    { turnNumber: 'A-001', citizenId: ciudadano1Id, serviceId: serviceAfiliacionesId, entityId: epsSuraId, status: 'waiting', queuePosition: 1, createdAt: now },
    { turnNumber: 'A-002', citizenId: ciudadano2Id, serviceId: serviceAfiliacionesId, entityId: epsSuraId, status: 'waiting', queuePosition: 2, createdAt: now },
    { turnNumber: 'A-003', citizenId: ciudadano3Id, serviceId: serviceAfiliacionesId, entityId: epsSuraId, status: 'called', queuePosition: 3, calledAt: new Date(now.getTime() - 5 * 60 * 1000), createdAt: now },
    { turnNumber: 'C-001', citizenId: ciudadano1Id, serviceId: serviceCuentasId, entityId: bancolombiaId, status: 'completed', queuePosition: 1, calledAt: new Date(now.getTime() - 30 * 60 * 1000), completedAt: new Date(now.getTime() - 15 * 60 * 1000), createdAt: yesterday },
    { turnNumber: 'C-002', citizenId: ciudadano2Id, serviceId: serviceCuentasId, entityId: bancolombiaId, status: 'attending', queuePosition: 1, calledAt: new Date(now.getTime() - 10 * 60 * 1000), createdAt: now },
    { turnNumber: 'D-001', citizenId: ciudadano3Id, serviceId: serviceDeclaracionesId, entityId: secretariaId, status: 'waiting', queuePosition: 1, createdAt: now },
    { turnNumber: 'P-001', citizenId: ciudadano1Id, serviceId: servicePagosId, entityId: secretariaId, status: 'cancelled', queuePosition: 1, createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000) },
    { turnNumber: 'L-001', citizenId: ciudadano2Id, serviceId: serviceLaboratorioId, entityId: epsSuraId, status: 'no_show', queuePosition: 1, calledAt: new Date(now.getTime() - 60 * 60 * 1000), createdAt: yesterday },
    { turnNumber: 'R-001', citizenId: ciudadano3Id, serviceId: serviceCreditosId, entityId: bancolombiaId, status: 'completed', queuePosition: 1, createdAt: yesterday, calledAt: new Date(now.getTime() - 3 * 60 * 60 * 1000), completedAt: new Date(now.getTime() - 2.5 * 60 * 60 * 1000) },
    { turnNumber: 'Ce-001', citizenId: ciudadano1Id, serviceId: serviceCertificadosId, entityId: secretariaId, status: 'waiting', queuePosition: 2, createdAt: now },
  ])

  console.log('Seed completed successfully!')
}

seed().catch(console.error)