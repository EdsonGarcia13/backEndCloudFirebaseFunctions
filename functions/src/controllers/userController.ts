import { Request, Response } from 'express';
import { db } from '../config/firebase';
import { User } from '../models/user.model';

export const userController = {
    async getUser(req: Request, res: Response) {
        try {
            const { email } = req.params;
            const userSnapshot = await db.collection('users')
                .where('email', '==', email)
                .get();
            
            if (userSnapshot.empty) {
                res.status(404).json({ message: 'User not found' });
                return;
            }
            
            const userData = userSnapshot.docs[0].data();
            res.status(200).json({ id: userSnapshot.docs[0].id, ...userData });
        } catch (error) {
            res.status(500).json({ error: 'Error fetching user' });
        }
    },

    async createUser(req: Request, res: Response) {
        try {
            const user: User = {
                email: req.body.email,
                createdAt: new Date()
            };
            
            const docRef = await db.collection('users').add(user);
            res.status(201).json({ id: docRef.id, ...user });
        } catch (error) {
            res.status(500).json({ error: 'Error creating user' });
        }
    }
};