import User from '../models/users.js';

export const createOrUpdateUser = async (userData, referrerId) => {
    const { id, username, firstname, lastname } = userData;
    let user = await User.findOne({ telegramId: id });

    if (!user) {
        user = new User({
            telegramId: id,
            username: username,
            firstname: firstname,
            lastname: lastname,
            referralLink: `https://t.me/tradingbotRecursionbot?start=${id}`,
            referrer: referrerId
        });

        if (referrerId) {
            const referrer = await User.findOne({ telegramId: referrerId });
            if (referrer) {
                if (!referrer.friends.includes(username)) {
                    referrer.blyndCoins += 10; // Referal mukofoti miqdori
                    referrer.friends.push(username);
                    await referrer.save();
                    console.log(`Added ${username} to ${referrer.username}'s friends list.`);
                } else {
                    console.log(`${username} is already a friend of ${referrer.username}.`);
                }
            }
        }
        await user.save();
    }
    return user;
};

export const verifyTelegramAuth = (data) => {
    if (!data.user || !data.user.id || !data.user.username || !data.user.firstname || !data.user.lastname) {
        console.log('Invalid data: Missing user information');
        return false;
    }
    return true;
}
