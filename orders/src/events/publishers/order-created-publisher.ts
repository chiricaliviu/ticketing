import { Publisher, OrderCreatedEvent, Subjects } from "@clgtickets/common";

export class OrderCreatedPublisher extends Publisher <OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated
}