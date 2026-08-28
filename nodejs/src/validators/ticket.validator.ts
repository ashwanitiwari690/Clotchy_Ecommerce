import { z } from "zod";

export const TICKET_STATUSES = ["open", "in-progress", "waiting-customer", "resolved", "closed"] as const;
export const TICKET_PRIORITIES = ["low", "medium", "high", "urgent"] as const;

export const createTicketSchema = z.object({
  body: z.object({
    subject: z.string().trim().min(3).max(200),
    category: z.string().trim().max(80).optional(),
    priority: z.enum(TICKET_PRIORITIES).default("medium"),
    message: z.string().trim().min(3).max(3000),
  }),
});

export const updateTicketSchema = z.object({
  body: z.object({
    status: z.enum(TICKET_STATUSES).optional(),
    priority: z.enum(TICKET_PRIORITIES).optional(),
    category: z.string().trim().max(80).optional(),
    assignedAdminId: z.string().uuid().nullable().optional(),
  }),
});

export const addTicketMessageSchema = z.object({
  body: z.object({
    message: z.string().trim().min(1).max(3000),
  }),
});
