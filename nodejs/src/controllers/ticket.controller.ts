import { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { prisma } from "../config/db";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";

const TICKET_INCLUDE = {
  customer: { select: { id: true, name: true, email: true, phone: true } },
  assignedAdmin: { select: { id: true, name: true } },
  messages: {
    include: { sender: { select: { id: true, name: true, role: true } } },
    orderBy: { createdAt: "asc" as const },
  },
} satisfies Prisma.TicketInclude;

type TicketWithMessages = Prisma.TicketGetPayload<{ include: typeof TICKET_INCLUDE }>;

const toTicketDto = (ticket: TicketWithMessages) => ({
  id: ticket.id,
  ticketNumber: ticket.ticketNumber,
  customerId: ticket.customerId,
  customerName: ticket.customer.name,
  customerEmail: ticket.customer.email,
  subject: ticket.subject,
  category: ticket.category,
  priority: ticket.priority,
  status: ticket.status,
  assignedAdmin: ticket.assignedAdmin?.name ?? null,
  assignedAdminId: ticket.assignedAdminId,
  createdAt: ticket.createdAt,
  updatedAt: ticket.updatedAt,
  messages: ticket.messages.map((m) => ({
    id: m.id,
    sender: m.sender.role === "ADMIN" ? "admin" : "customer",
    senderName: m.sender.name,
    message: m.message,
    date: m.createdAt,
  })),
});

const isOwnerOrAdmin = (req: Request, customerId: string) => req.user!.role === "ADMIN" || req.user!.id === customerId;

export const createTicket = asyncHandler(async (req: Request, res: Response) => {
  const { subject, category, priority, message } = req.body as {
    subject: string;
    category?: string;
    priority: string;
    message: string;
  };

  const ticketNumber = `TKT-${Date.now().toString(36).toUpperCase()}`;

  const ticket = await prisma.ticket.create({
    data: {
      ticketNumber,
      customerId: req.user!.id,
      subject,
      category,
      priority,
      messages: { create: { senderId: req.user!.id, message } },
    },
    include: TICKET_INCLUDE,
  });

  res.status(201).json({ success: true, data: toTicketDto(ticket) });
});

export const listTickets = asyncHandler(async (req: Request, res: Response) => {
  const isAdmin = req.user!.role === "ADMIN";
  const { status, priority, search, page: pageQ, pageSize: pageSizeQ } = req.query as Record<
    string,
    string | undefined
  >;
  const page = Math.max(1, Number(pageQ) || 1);
  const pageSize = Math.min(50, Number(pageSizeQ) || 20);

  const where: Prisma.TicketWhereInput = {
    ...(isAdmin ? {} : { customerId: req.user!.id }),
    ...(status ? { status } : {}),
    ...(priority ? { priority } : {}),
    ...(search
      ? {
          OR: [
            { ticketNumber: { contains: search, mode: "insensitive" } },
            { subject: { contains: search, mode: "insensitive" } },
            { customer: { name: { contains: search, mode: "insensitive" } } },
          ],
        }
      : {}),
  };

  const [tickets, total] = await prisma.$transaction([
    prisma.ticket.findMany({
      where,
      include: TICKET_INCLUDE,
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.ticket.count({ where }),
  ]);

  res.json({ success: true, data: tickets.map(toTicketDto), meta: { page, pageSize, total } });
});

export const getTicket = asyncHandler(async (req: Request, res: Response) => {
  const ticket = await prisma.ticket.findUnique({ where: { id: req.params.id }, include: TICKET_INCLUDE });
  if (!ticket) throw ApiError.notFound("Ticket not found");
  if (!isOwnerOrAdmin(req, ticket.customerId)) throw ApiError.forbidden();
  res.json({ success: true, data: toTicketDto(ticket) });
});

export const updateTicket = asyncHandler(async (req: Request, res: Response) => {
  const ticket = await prisma.ticket
    .update({ where: { id: req.params.id }, data: req.body, include: TICKET_INCLUDE })
    .catch(() => null);
  if (!ticket) throw ApiError.notFound("Ticket not found");
  res.json({ success: true, data: toTicketDto(ticket) });
});

export const addTicketMessage = asyncHandler(async (req: Request, res: Response) => {
  const existing = await prisma.ticket.findUnique({ where: { id: req.params.id }, select: { customerId: true } });
  if (!existing) throw ApiError.notFound("Ticket not found");
  if (!isOwnerOrAdmin(req, existing.customerId)) throw ApiError.forbidden();

  const { message } = req.body as { message: string };

  const ticket = await prisma.ticket.update({
    where: { id: req.params.id },
    data: {
      updatedAt: new Date(),
      messages: { create: { senderId: req.user!.id, message } },
    },
    include: TICKET_INCLUDE,
  });

  res.status(201).json({ success: true, data: toTicketDto(ticket) });
});
