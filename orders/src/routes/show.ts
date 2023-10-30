import express , {Request, Response } from 'express';
import { NotAuthorizedError, NotFoundError, requireAuth } from '@clgtickets/common';
import { Order } from '../models/order';

const router = express.Router();

router.get('/api/orders/:orderId', requireAuth,async (req: Request, res: Response) => {
    console.log(req.params.orderId);
    const order = await Order.findById(req.params.orderId).populate('ticket');
    console.log(order);
    if(!order) {
        throw new NotFoundError();
    }
    if(order.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError();
    }
    res.send(order);
});

export {router as showOrderRouter};