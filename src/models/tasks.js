import  mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    title: String,
    img: String,
    task_text: String,
    status: {
        type: String,
        enum: ['blocked', 'claim', 'done', 'open'],
        default: 'blocked'
    },
    link: String
});

const Task = mongoose.model('Task', taskSchema);

export default Task;