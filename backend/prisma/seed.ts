import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@flooringbyexperts.com';

  // Create admin user
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: 'Admin',
      role: 'ADMIN',
      passwordHash: await bcrypt.hash('Admin123!', 10),
    },
  });

  // Create client
  const client = await prisma.client.create({
    data: {
      name: 'Acme Corp',
      mainContact: 'Jane Doe',
      billingAddress: '123 Main St',
      email: 'jane@acme.com',
    },
  });

  // Create provider
  const provider = await prisma.provider.create({
    data: {
      name: 'WoodPro',
      contactInfo: 'orders@woodpro.com',
    },
  });

  // Create product
  const product = await prisma.product.create({
    data: {
      name: 'Oak Plank Wide',
      type: 'Wood',
      thickness: '12mm',
      providerId: provider.id,
      costPerUnit: 25.5,
      salesPrice: 40.0,
    },
  });

  // Create installer user and installer
  const installerUser = await prisma.user.create({
    data: {
      email: 'installer1@flooringbyexperts.com',
      name: 'Installer One',
      role: 'INSTALLER',
    },
  });

  const installer = await prisma.installer.create({
    data: {
      userId: installerUser.id,
      name: 'Installer One',
      email: installerUser.email,
      phone: '+34 600000000',
      costRateDaily: 180.0,
    },
  });

  // Create project
  const project = await prisma.project.create({
    data: {
      clientId: client.id,
      name: 'Lobby Renovation',
      description: 'Vinyl installation in lobby',
      siteAddress: 'Carrer de Mar 12, Badalona',
      siteContact: 'Juan Perez',
      status: 'QUOTING',
      projectValue: 10000,
      estimatedCosts: 6000,
    },
  });

  // Create quote
  await prisma.quote.create({
    data: {
      projectId: project.id,
      createdByEmail: adminEmail,
      assessmentNotes: 'Subfloor in good condition',
      status: 'DRAFT',
      totalMaterial: 3000,
      totalLabor: 2700,
      totalPrice: 9000,
      lineItems: {
        create: [
          {
            areaDescription: 'Lobby main area',
            areaSqFt: 1200,
            productId: product.id,
            estimatedLaborDays: 5,
          },
        ],
      },
    },
  });

  // Create work order
  await prisma.workOrder.create({
    data: {
      projectId: project.id,
      assignedInstallerId: installer.id,
      scheduledStart: new Date(),
      estimatedDuration: 5,
      status: 'ASSIGNED',
      specs: 'Thickness 12mm',
    },
  });

  console.log('Seed complete');
}

main().finally(() => prisma.$disconnect());
