import express from 'express'
import { createSender, getDefaultSenderAddress, getSenderById, getAllSenders, updateSender, deleteSender } from './../controllers/addresses/senderAddress.js'
import { authMiddleware, roleMiddleware } from '../middlewares/autherization.js';

const senderRouter = express.Router();

senderRouter.post('/', authMiddleware, roleMiddleware(["admin"]), createSender);
senderRouter.get('/default', getDefaultSenderAddress);
senderRouter.get('/:id', getSenderById);
senderRouter.get('/', authMiddleware, roleMiddleware(["admin"]), getAllSenders);
senderRouter.put('/:id', authMiddleware, roleMiddleware(["admin"]), updateSender);
senderRouter.delete('/:id', authMiddleware, roleMiddleware(["admin"]), deleteSender);

export default senderRouter;
