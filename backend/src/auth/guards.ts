import jwt from 'jsonwebtoken';
import { Role } from './roles';

export function requireAuth(req: any, res: any, next: any) {
	const token = (req.headers.authorization || '').replace('Bearer ', '');
	if (!token) return res.status(401).json({ error: 'Unauthorized' });
	try {
		(req as any).user = jwt.verify(token, process.env.JWT_SECRET!);
		next();
	} catch {
		res.status(401).json({ error: 'Invalid token' });
	}
}

export function requireRole(roles: Role[]) {
	return (req: any, res: any, next: any) => {
		const user = (req as any).user;
		if (!user || !roles.includes(user.role)) {
			return res.status(403).json({ error: 'Forbidden' });
		}
		next();
	};
}
