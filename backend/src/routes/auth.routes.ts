import { Router } from 'express';
import passport from '../auth/googleStrategy';

const router = Router();

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
	'/auth/google/callback',
	passport.authenticate('google', { session: false }),
	(req: any, res: any) => {
		const { token } = req.user;
		res.redirect(`http://localhost:4200/auth/callback?token=${token}`);
	}
);

export default router;
