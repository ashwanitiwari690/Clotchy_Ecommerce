import { Router } from "express";
import { createTicket, listTickets, getTicket, updateTicket, addTicketMessage } from "../controllers/ticket.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { createTicketSchema, updateTicketSchema, addTicketMessageSchema } from "../validators/ticket.validator";

const router = Router();

router.use(authenticate);

router.get("/", listTickets);
router.get("/:id", getTicket);
router.post("/", validate(createTicketSchema), createTicket);
router.post("/:id/messages", validate(addTicketMessageSchema), addTicketMessage);
router.patch("/:id", authorize("ADMIN"), validate(updateTicketSchema), updateTicket);

export default router;
