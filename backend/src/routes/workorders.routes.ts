import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth, requireRole } from '../auth/guards';
import { Role } from '../auth/roles';

const prisma = new PrismaClient();
const router = Router();

// Get all work orders (admin/sales manager only)
router.get(
	'/workorders',
	requireAuth,
	requireRole([Role.ADMIN, Role.SALES_MANAGER]),
	async (_req, res) => {
		const wos = await prisma.workOrder.findMany({
			include: { project: true, assignedInstaller: true, photos: true },
		});
		res.json(wos);
	}
);

// Get my work orders (installer only)
router.get(
	'/workorders/my',
	requireAuth,
	requireRole([Role.INSTALLER]),
	async (req: any, res: any) => {
		const email = req.user.email;
		const installer = await prisma.installer.findFirst({
			where: { email },
		});
		if (!installer) return res.json([]);
		const wos = await prisma.workOrder.findMany({
			where: {
				assignedInstallerId: installer.id,
				NOT: { status: 'COMPLETED' },
			},
			select: {
				id: true,
				status: true,
				scheduledStart: true,
				estimatedDuration: true,
				specs: true,
				project: {
					select: { name: true, siteAddress: true, siteContact: true },
				},
				photos: true,
			},
		});
		res.json(wos);
	}
);

// Update work order status
router.patch(
	'/workorders/:id/status',
	requireAuth,
	async (req, res) => {
		const { id } = req.params;
		const { status } = req.body;
		const wo = await prisma.workOrder.update({
			where: { id },
			data: { status },
		});
		if (status === 'COMPLETED') {
			await prisma.project.update({
				where: { id: wo.projectId },
				data: { status: 'REVIEW_NEEDED' },
			});
			await prisma.quote.updateMany({
				where: { projectId: wo.projectId },
				data: { status: 'READY_TO_INVOICE' },
			});
		}
		res.json(wo);
	}
);

export default router;
