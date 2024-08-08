import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    telegramId: {
        type: Number,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    cbkCoins: {
        type: Number,
        default: 0 
    },
    friends: {
        type: [String],
        default: [] 
    },
    referralLink: {
        type: String,
        unique: true
    },
    referrer: {
        type: String,
        default: null
    }
});

const User = mongoose.model('User', userSchema);

export default User;
