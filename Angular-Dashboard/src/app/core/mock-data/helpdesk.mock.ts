import { ContactMessage, Faq, Ticket } from '../models/ticket.model';

export const TICKETS_MOCK: Ticket[] = [
  {
    id: 'TKT-5001', customerId: 'cust-002', customerName: 'Rohan Mehta', customerEmail: 'rohan.mehta@example.com',
    subject: 'Wrong size delivered', category: 'Order Issue', priority: 'high', assignedAdmin: 'Aarav Singh',
    createdAt: '2026-08-14', updatedAt: '2026-08-15', status: 'in-progress',
    messages: [
      { id: 'm1', sender: 'customer', senderName: 'Rohan Mehta', message: 'I ordered size 32 but received size 34 jeans. Order CLT-100236.', date: '2026-08-14' },
      { id: 'm2', sender: 'admin', senderName: 'Aarav Singh', message: 'Sorry about that Rohan, we have initiated a free exchange pickup for tomorrow.', date: '2026-08-15' },
    ],
  },
  {
    id: 'TKT-5002', customerId: 'cust-006', customerName: 'Arjun Kapoor', customerEmail: 'arjun.kapoor@example.com',
    subject: 'Refund not received', category: 'Payments', priority: 'urgent', assignedAdmin: 'Meera Iyer',
    createdAt: '2026-08-11', updatedAt: '2026-08-16', status: 'waiting-customer',
    messages: [
      { id: 'm1', sender: 'customer', senderName: 'Arjun Kapoor', message: 'My order was cancelled 5 days ago, refund still not credited.', date: '2026-08-11' },
      { id: 'm2', sender: 'admin', senderName: 'Meera Iyer', message: 'Refund was processed on our end on Aug 13, could you confirm your bank statement?', date: '2026-08-16' },
    ],
  },
  {
    id: 'TKT-5003', customerId: 'cust-009', customerName: 'Neha Joshi', customerEmail: 'neha.joshi@example.com',
    subject: 'Account access blocked', category: 'Account', priority: 'medium', assignedAdmin: 'Aarav Singh',
    createdAt: '2026-08-09', updatedAt: '2026-08-09', status: 'open',
    messages: [{ id: 'm1', sender: 'customer', senderName: 'Neha Joshi', message: 'I cannot log in to my account, it says blocked.', date: '2026-08-09' }],
  },
  {
    id: 'TKT-5004', customerId: 'cust-005', customerName: 'Kavya Reddy', customerEmail: 'kavya.reddy@example.com',
    subject: 'Product quality concern', category: 'Product', priority: 'low', assignedAdmin: 'Meera Iyer',
    createdAt: '2026-08-05', updatedAt: '2026-08-06', status: 'resolved',
    messages: [
      { id: 'm1', sender: 'customer', senderName: 'Kavya Reddy', message: 'Polo shirt stitching came loose after first wash.', date: '2026-08-05' },
      { id: 'm2', sender: 'admin', senderName: 'Meera Iyer', message: 'We have shipped a replacement, tracking sent to your email.', date: '2026-08-06' },
    ],
  },
  {
    id: 'TKT-5005', customerId: 'cust-004', customerName: 'Vikram Singh', customerEmail: 'vikram.singh@example.com',
    subject: 'Delivery delay', category: 'Shipping', priority: 'medium', assignedAdmin: 'Aarav Singh',
    createdAt: '2026-07-30', updatedAt: '2026-08-01', status: 'closed',
    messages: [{ id: 'm1', sender: 'customer', senderName: 'Vikram Singh', message: 'Package was 4 days late, just flagging for feedback.', date: '2026-07-30' }],
  },
];

export const CONTACT_MESSAGES_MOCK: ContactMessage[] = [
  { id: 'cm-001', name: 'Simran Kaur', email: 'simran.kaur@example.com', subject: 'Bulk order enquiry', message: 'Do you offer bulk pricing for corporate gifting?', date: '2026-08-15', status: 'new' },
  { id: 'cm-002', name: 'Farhan Ali', email: 'farhan.ali@example.com', subject: 'Store partnership', message: 'Interested in a stockist partnership in Delhi NCR.', date: '2026-08-13', status: 'read' },
  { id: 'cm-003', name: 'Tanya Kapoor', email: 'tanya.kapoor@example.com', subject: 'Return policy question', message: 'What is the return window for sale items?', date: '2026-08-10', status: 'replied' },
  { id: 'cm-004', name: 'Devansh Gupta', email: 'devansh.gupta@example.com', subject: 'Sizing help', message: 'Need help choosing between M and L for the oversized tee.', date: '2026-08-07', status: 'closed' },
  { id: 'cm-005', name: 'Riya Malhotra', email: 'riya.malhotra@example.com', subject: 'Press enquiry', message: 'Writing a feature on emerging fashion labels, would love to connect.', date: '2026-08-02', status: 'new' },
];

export const FAQS_MOCK: Faq[] = [
  { id: 'faq-001', question: 'What is your return policy?', answer: 'Unused items can be returned within 15 days of delivery for a full refund.', category: 'Returns', displayOrder: 1, status: 'active' },
  { id: 'faq-002', question: 'How long does shipping take?', answer: 'Orders are typically delivered within 3-7 business days across India.', category: 'Shipping', displayOrder: 2, status: 'active' },
  { id: 'faq-003', question: 'Do you offer international shipping?', answer: 'Currently we ship only within India, international shipping is coming soon.', category: 'Shipping', displayOrder: 3, status: 'active' },
  { id: 'faq-004', question: 'How do I track my order?', answer: 'You will receive a tracking link via email and SMS once your order ships.', category: 'Orders', displayOrder: 4, status: 'active' },
  { id: 'faq-005', question: 'What payment methods do you accept?', answer: 'We accept UPI, credit/debit cards, net banking and cash on delivery.', category: 'Payments', displayOrder: 5, status: 'active' },
  { id: 'faq-006', question: 'How do I find my size?', answer: 'Refer to our size guide on every product page for detailed measurements.', category: 'Products', displayOrder: 6, status: 'active' },
  { id: 'faq-007', question: 'Can I cancel my order?', answer: 'Orders can be cancelled free of charge before they are shipped.', category: 'Orders', displayOrder: 7, status: 'active' },
  { id: 'faq-008', question: 'Do you offer gift wrapping?', answer: 'Gift wrapping is available at checkout for a small additional fee.', category: 'Orders', displayOrder: 8, status: 'inactive' },
];
