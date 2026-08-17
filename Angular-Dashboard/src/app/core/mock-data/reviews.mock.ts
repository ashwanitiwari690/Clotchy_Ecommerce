import { Review } from '../models/review.model';

export const REVIEWS_MOCK: Review[] = [
  { id: 'rev-001', productId: 'prod-004', productName: 'Premium Hoodie', customerId: 'cust-001', customerName: 'Ananya Sharma', rating: 5, comment: 'Incredibly soft and warm, fits exactly as expected. My new everyday hoodie.', date: '2026-08-01', status: 'approved' },
  { id: 'rev-002', productId: 'prod-010', productName: 'Court Leather Sneakers', customerId: 'cust-010', customerName: 'Karan Malhotra', rating: 5, comment: 'The leather quality is outstanding for the price. Comfortable from day one.', date: '2026-07-28', status: 'approved' },
  { id: 'rev-003', productId: 'prod-001', productName: 'Premium Oversized T-Shirt', customerId: 'cust-002', customerName: 'Rohan Mehta', rating: 4, comment: 'Great oversized fit, though the black slightly fades after a few washes.', date: '2026-07-25', status: 'approved' },
  { id: 'rev-004', productId: 'prod-008', productName: 'Wrap Midi Dress', customerId: 'cust-003', customerName: 'Priya Nair', rating: 5, comment: 'Elegant and flattering, got so many compliments at the event.', date: '2026-07-22', status: 'pending' },
  { id: 'rev-005', productId: 'prod-003', productName: 'Relaxed Fit Jeans', customerId: 'cust-005', customerName: 'Kavya Reddy', rating: 3, comment: 'Fit is good but the fabric feels thinner than I expected for the price.', date: '2026-07-19', status: 'pending' },
  { id: 'rev-006', productId: 'prod-015', productName: 'Canvas High-Top Sneakers', customerId: 'cust-006', customerName: 'Arjun Kapoor', rating: 2, comment: 'Sole started peeling after three weeks of light use. Disappointed.', date: '2026-07-15', status: 'rejected' },
  { id: 'rev-007', productId: 'prod-006', productName: 'Designer Sweatshirt', customerId: 'cust-007', customerName: 'Ishita Verma', rating: 5, comment: 'Premium feel, the embroidery detail is subtle and classy.', date: '2026-07-10', status: 'approved' },
  { id: 'rev-008', productId: 'prod-014', productName: 'Satin Slip Dress', customerId: 'cust-001', customerName: 'Ananya Sharma', rating: 4, comment: 'Beautiful drape, runs slightly small so size up.', date: '2026-07-05', status: 'approved' },
  { id: 'rev-009', productId: 'prod-012', productName: 'Distressed Denim Jacket', customerId: 'cust-010', customerName: 'Karan Malhotra', rating: 4, comment: 'Solid denim weight, distressing looks natural not overdone.', date: '2026-06-29', status: 'pending' },
  { id: 'rev-010', productId: 'prod-009', productName: 'Structured Tote Bag', customerId: 'cust-003', customerName: 'Priya Nair', rating: 5, comment: 'Fits my 14-inch laptop perfectly, structure holds shape all day.', date: '2026-06-20', status: 'approved' },
];
