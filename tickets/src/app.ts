import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { createTicketRouter } from "./routes/new";
import { showTicketRouter } from "./routes/show";
import { indexTicketRouter } from "./routes";
import { updateTicketRouter } from "./routes/update";

import { currentUser } from "@clgtickets/common";
import { errorHandler } from "@clgtickets/common";
import { NotFoundError } from "@clgtickets/common";

const app = express();
app.set('trust proxy', true);//s
app.use(json());
app.use(cookieSession({
    signed: false,
    secure:process.env.NODE_ENV !== 'test'
}))

app.use(currentUser);

app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(indexTicketRouter);
app.use(updateTicketRouter);

app.all("*", async (req, res, next) => {
  next(new NotFoundError());
});

app.use(errorHandler);

export {app};