import Task from "../models/tasks.js";
import User from "../models/users.js";

// Referal orqali foydalanuvchi mukofoti berish
export const createOrUpdateUser = async (userData, referrerId) => {
    const { id, username, firstname, lastname } = userData;
    let user = await User.findOne({ telegramId: id });

    if (!user) {
        const tasks = await Task.find();
        user = new User({
            telegramId: id,
            username: username,
            firstname: firstname,
            lastname: lastname,
            referralLink: `https://t.me/tradingbotRecursionbot?start=${id}`,
            referrer: referrerId,
            tasks: tasks.map(task => ({
                taskId: task._id,
                title: task.title,
                img: task.img,
                task_text: task.task_text,
                reward: task.reward,
                link: task.link,
                status: task.status
            }))
        });

        if (referrerId) {
            const referrer = await User.findOne({ telegramId: referrerId });
            if (referrer) {
                if (!referrer.friends.includes(username)) {
                    referrer.cbkCoins += 150; // Referal mukofoti miqdori
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

// Vazifalarni yaratish
export const createTask = async (req, res) => {
    const { title, img, task_text, reward, link } = req.body;

    try {
        const newTask = new Task({
            title,
            img,
            task_text,
            reward,
            link,
            status: link && link !== '' ? 'open' : 'blocked'
        });

        await newTask.save();
        await User.updateMany({}, { $push: { tasks: newTask } });

        res.status(201).json({ success: true, task: newTask });
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Vazifalarni olish
export const getTasks = async (req, res) => {
    const { telegramId } = req.body;

    try {
        const user = await User.findOne({ telegramId });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const tasks = await Task.find();

        res.json({ success: true, tasks });
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Vazifalarni talab qilish
export const claimTask = async (req, res) => {
    const { telegramId, taskId } = req.body;

    try {
        const user = await User.findOne({ telegramId });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const userTask = user.tasks.id(taskId);
        if (!userTask) {
            return res.status(404).json({ success: false, message: 'Task not found in user tasks' });
        }

        if (userTask.status !== 'claim') {
            return res.status(400).json({ success: false, message: 'Task is not in claimable status' });
        }

        user.cbkCoins += userTask.reward;
        userTask.status = 'done';

        await user.save();

        res.json({ success: true, cbkCoins: user.cbkCoins, task: userTask });
    } catch (error) {
        console.error('Error claiming task:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Vazifa holatini yangilash
export const updateTaskStatus = async (req, res) => {
    const { telegramId, taskId, newStatus } = req.body;
    console.log( telegramId, taskId, newStatus)

    try {
        const user = await User.findOne({ telegramId });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const task = user.tasks.id(taskId);
        if (!task) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }

        console.log('Current task status:', task.status);
        task.status = newStatus;
        console.log('Updated task status:', task.status);
        
        await user.save();
        console.log('User saved with updated task status');
        res.json({ success: true, task });
    } catch (error) {
        console.error('Error updating task status:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
