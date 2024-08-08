import { createOrUpdateUser, verifyTelegramAuth } from '../services/authService.js';

// Telegram authentication
export const telegramAuth = async (req, res) => {
    const initData = req.body;
    const referrerId = req.body.start_param;

    if (!verifyTelegramAuth(initData)) {
        return res.status(400).json({ success: false, message: 'Invalid data' });
    }

    try {
        const user = await createOrUpdateUser(initData.user, referrerId);
        res.json({ success: true, user });
    } catch (error) {
        console.error('Error during authentication:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
