import { Customer, CustomerGroup } from '../models/customer.model';
import { placeholderImage } from '../models/common.model';

export const CUSTOMER_GROUPS_MOCK: CustomerGroup[] = [
  { id: 'grp-vip', name: 'VIP', description: 'Top 5% spenders, early access to drops.', customerCount: 3 },
  { id: 'grp-regular', name: 'Regular', description: 'Standard registered customers.', customerCount: 6 },
  { id: 'grp-wholesale', name: 'Wholesale', description: 'Bulk-order business accounts.', customerCount: 1 },
];

export const CUSTOMERS_MOCK: Customer[] = [
  {
    id: 'cust-001', name: 'Ananya Sharma', email: 'ananya.sharma@example.com', phone: '+91 98765 43210',
    avatar: placeholderImage('cust-001', 150, 150), registeredAt: '2025-03-14', groupId: 'grp-vip',
    totalOrders: 14, totalSpent: 68450, status: 'active',
    addresses: [{ id: 'addr-001', label: 'Home', line1: '221 Marine Drive', city: 'Mumbai', state: 'Maharashtra', zip: '400002', country: 'India', isDefault: true }],
    wishlistProductIds: ['prod-004', 'prod-010'],
  },
  {
    id: 'cust-002', name: 'Rohan Mehta', email: 'rohan.mehta@example.com', phone: '+91 98123 45678',
    avatar: placeholderImage('cust-002', 150, 150), registeredAt: '2025-05-02', groupId: 'grp-regular',
    totalOrders: 6, totalSpent: 21340, status: 'active',
    addresses: [{ id: 'addr-002', label: 'Home', line1: '14 MG Road', city: 'Bengaluru', state: 'Karnataka', zip: '560001', country: 'India', isDefault: true }],
    wishlistProductIds: ['prod-003'],
  },
  {
    id: 'cust-003', name: 'Priya Nair', email: 'priya.nair@example.com', phone: '+91 99887 66554',
    avatar: placeholderImage('cust-003', 150, 150), registeredAt: '2025-07-20', groupId: 'grp-vip',
    totalOrders: 21, totalSpent: 94210, status: 'active',
    addresses: [{ id: 'addr-003', label: 'Home', line1: '9 Church Street', city: 'Kochi', state: 'Kerala', zip: '682001', country: 'India', isDefault: true }],
    wishlistProductIds: ['prod-008', 'prod-014'],
  },
  {
    id: 'cust-004', name: 'Vikram Singh', email: 'vikram.singh@example.com', phone: '+91 97654 32109',
    avatar: placeholderImage('cust-004', 150, 150), registeredAt: '2025-09-11', groupId: 'grp-regular',
    totalOrders: 3, totalSpent: 8970, status: 'inactive',
    addresses: [{ id: 'addr-004', label: 'Office', line1: '55 Sector 18', city: 'Gurugram', state: 'Haryana', zip: '122001', country: 'India', isDefault: true }],
    wishlistProductIds: [],
  },
  {
    id: 'cust-005', name: 'Kavya Reddy', email: 'kavya.reddy@example.com', phone: '+91 96543 21098',
    avatar: placeholderImage('cust-005', 150, 150), registeredAt: '2025-10-30', groupId: 'grp-regular',
    totalOrders: 8, totalSpent: 27680, status: 'active',
    addresses: [{ id: 'addr-005', label: 'Home', line1: '77 Jubilee Hills', city: 'Hyderabad', state: 'Telangana', zip: '500033', country: 'India', isDefault: true }],
    wishlistProductIds: ['prod-011'],
  },
  {
    id: 'cust-006', name: 'Arjun Kapoor', email: 'arjun.kapoor@example.com', phone: '+91 95432 10987',
    avatar: placeholderImage('cust-006', 150, 150), registeredAt: '2025-11-08', groupId: 'grp-regular',
    totalOrders: 2, totalSpent: 5498, status: 'active',
    addresses: [{ id: 'addr-006', label: 'Home', line1: '3 Camac Street', city: 'Kolkata', state: 'West Bengal', zip: '700016', country: 'India', isDefault: true }],
    wishlistProductIds: ['prod-005'],
  },
  {
    id: 'cust-007', name: 'Ishita Verma', email: 'ishita.verma@example.com', phone: '+91 94321 09876',
    avatar: placeholderImage('cust-007', 150, 150), registeredAt: '2025-12-01', groupId: 'grp-regular',
    totalOrders: 5, totalSpent: 15230, status: 'active',
    addresses: [{ id: 'addr-007', label: 'Home', line1: '18 Park Street', city: 'Pune', state: 'Maharashtra', zip: '411001', country: 'India', isDefault: true }],
    wishlistProductIds: [],
  },
  {
    id: 'cust-008', name: 'Aditya Rao', email: 'aditya.rao@example.com', phone: '+91 93210 98765',
    avatar: placeholderImage('cust-008', 150, 150), registeredAt: '2026-01-05', groupId: 'grp-wholesale',
    totalOrders: 34, totalSpent: 312400, status: 'active',
    addresses: [{ id: 'addr-008', label: 'Warehouse', line1: '210 Industrial Area', city: 'Ahmedabad', state: 'Gujarat', zip: '380001', country: 'India', isDefault: true }],
    wishlistProductIds: [],
  },
  {
    id: 'cust-009', name: 'Neha Joshi', email: 'neha.joshi@example.com', phone: '+91 92109 87654',
    avatar: placeholderImage('cust-009', 150, 150), registeredAt: '2026-01-19', groupId: 'grp-regular',
    totalOrders: 1, totalSpent: 1999, status: 'blocked',
    addresses: [{ id: 'addr-009', label: 'Home', line1: '65 Civil Lines', city: 'Jaipur', state: 'Rajasthan', zip: '302006', country: 'India', isDefault: true }],
    wishlistProductIds: [],
  },
  {
    id: 'cust-010', name: 'Karan Malhotra', email: 'karan.malhotra@example.com', phone: '+91 91098 76543',
    avatar: placeholderImage('cust-010', 150, 150), registeredAt: '2026-02-02', groupId: 'grp-vip',
    totalOrders: 11, totalSpent: 51670, status: 'active',
    addresses: [{ id: 'addr-010', label: 'Home', line1: '42 Sector 29', city: 'Chandigarh', state: 'Punjab', zip: '160030', country: 'India', isDefault: true }],
    wishlistProductIds: ['prod-010', 'prod-012'],
  },
];

export function getCustomerById(id: string): Customer | undefined {
  return CUSTOMERS_MOCK.find(c => c.id === id);
}
