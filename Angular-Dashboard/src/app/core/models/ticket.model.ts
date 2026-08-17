export type TicketStatus = 'open' | 'in-progress' | 'waiting-customer' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface TicketMessage {
  id: string;
  sender: 'customer' | 'admin';
  senderName: string;
  message: string;
  date: string;
}

export interface Ticket {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  subject: string;
  category: string;
  priority: TicketPriority;
  assignedAdmin: string;
  createdAt: string;
  updatedAt: string;
  status: TicketStatus;
  messages: TicketMessage[];
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  status: 'new' | 'read' | 'replied' | 'closed';
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
  category: string;
  displayOrder: number;
  status: 'active' | 'inactive';
}
