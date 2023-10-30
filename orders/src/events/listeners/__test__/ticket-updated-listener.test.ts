import { natsWrapper } from "../../../nats-wrapper";
import { TicketUpdatedListener } from "../ticket-updated-listener";
import { Ticket } from "../../../models/ticket";
import mongoose from "mongoose";
import { TicketUpdatedEvent } from "@clgtickets/common";
import { Message } from "node-nats-streaming";

const setup = async () => {
  // create a litener
  const listener = new TicketUpdatedListener(natsWrapper.client);
  // create and save a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });

  await ticket.save();

  // create a fake data object
  const data: TicketUpdatedEvent["data"] = {
    id: ticket.id,
    version: ticket.version + 1,
    title: "New concert",
    price: 115,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };
  // create fake msg object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  // return all of this stuff

  return { msg, data, ticket, listener };
};

it("finds, updates and saves a ticket", async () => {
  const { msg, data, ticket, listener } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
  expect(updatedTicket!.version).toEqual(data.version);
});

it("acks the message", async () => {
  const { msg, data, listener } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it("Does not call ack if the event has a skipped version number", async () => {
  const { msg, data, listener, ticket } = await setup();

  data.version = 15;

  try {
    await listener.onMessage(data, msg);
  } catch (err) {}

  expect (msg.ack).not.toHaveBeenCalled();
});
