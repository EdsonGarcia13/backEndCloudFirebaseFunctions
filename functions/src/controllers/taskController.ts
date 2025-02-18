import { Request, Response } from 'express';
import { db } from '../config/firebase';
import { Task } from '../models/task.model';

export const taskController = {
    async getTasks(req: Request, res: Response) {
        try {
            const userId = req.query.userId as string;
            const tasksSnapshot = await db.collection('tasks')
                .where('userId', '==', userId)
                .orderBy('createdAt', 'desc')
                .get();
            
            const tasks = tasksSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            
            res.status(200).json(tasks);
        } catch (error) {
            res.status(500).json({ error: 'Error fetching tasks' });
        }
    },

    async createTask(req: Request, res: Response) {
        try {
            const task: Task = {
                ...req.body,
                createdAt: new Date(),
                completed: false
            };
            
            const docRef = await db.collection('tasks').add(task);
            res.status(201).json({ id: docRef.id, ...task });
        } catch (error) {
            res.status(500).json({ error: 'Error creating task' });
        }
    },

    async updateTask(req: Request, res: Response) {
        try {
            const { taskId } = req.params;
            await db.collection('tasks').doc(taskId).update(req.body);
            res.status(200).json({ message: 'Task updated successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Error updating task' });
        }
    },

    async deleteTask(req: Request, res: Response) {
        try {
            const { taskId } = req.params;
            await db.collection('tasks').doc(taskId).delete();
            res.status(200).json({ message: 'Task deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Error deleting task' });
        }
    }
};
