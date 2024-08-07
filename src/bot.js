import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN);

export const startBot = () => {
    bot.start(async (ctx) => {
        const startPayload = ctx.startPayload;
        console.log('Start payload:', startPayload);

        let referrerId = null;
        if (startPayload) {
            referrerId = startPayload;
            console.log('Referrer ID:', referrerId);
        }

        const userData = {
            id: ctx.from.id,
            username: ctx.from.username,
            firstname: ctx.from.first_name,
            lastname: ctx.from.last_name
        };

        try {
            const response = await axios.post('https://twaback.onrender.com/auth/telegram', {
                user: userData,
                start_param: referrerId
            });

            if (response.data.success) {
                ctx.reply('Welcome to Trading Bot Recursion! You have been successfully authenticated.');
            } else {
                ctx.reply('Authentication failed. Please try again.');
            }
        } catch (error) {
            console.error('Error during authentication:', error);
            ctx.reply('Server error during authentication. Please try again later.');
        }
    });

    bot.launch().then(() => console.log('Bot started'));
};
