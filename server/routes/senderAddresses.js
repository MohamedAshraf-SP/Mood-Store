import express from 'express'
import { createSender, getDefaultSenderAddress, getSenderById, getAllSenders, updateSender, deleteSender } from './../controllers/addresses/senderAddress.js'

const senderRouter = express.Router();
senderRouter.post('/', createSender);
senderRouter.get('/default', getDefaultSenderAddress);
senderRouter.get('/:id', getSenderById);
senderRouter.get('/', getAllSenders);
senderRouter.put('/:id', updateSender);
senderRouter.delete('/:id', deleteSender);

export default senderRouter;
