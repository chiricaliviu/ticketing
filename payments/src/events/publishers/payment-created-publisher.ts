import { Subjects, Publisher, PaymentCreatedEvent } from "@clgtickets/common";

export class PaymentCreatedPublisher extends Publisher < PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated =  Subjects.PaymentCreated;
}