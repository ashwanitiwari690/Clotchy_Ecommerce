import { INavData } from '@coreui/angular';

export const navItemsEcommerce: INavData[] = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    iconComponent: { name: 'cilSpeedometer' },
  },

  { name: 'Catalog', title: true },
  {
    name: 'Catalog',
    url: '/products',
    iconComponent: { name: 'cilBasket' },
    children: [
      { name: 'Products', url: '/products', icon: 'nav-icon-bullet' },
      { name: 'Categories', url: '/categories', icon: 'nav-icon-bullet' },
      { name: 'Collections', url: '/collections', icon: 'nav-icon-bullet' },
      // { name: 'Brands', url: '/brands', icon: 'nav-icon-bullet' },
      // { name: 'Product Attributes', url: '/attributes', icon: 'nav-icon-bullet' },
      // { name: 'Product Reviews', url: '/reviews', icon: 'nav-icon-bullet' },
      { name: 'Inventory', url: '/inventory', icon: 'nav-icon-bullet' },
    ],
  },

  { name: 'Sales', title: true },
  {
    name: 'Orders',
    url: '/orders',
    iconComponent: { name: 'cilCart' },
    children: [
      { name: 'All Orders', url: '/orders', icon: 'nav-icon-bullet' },
      { name: 'Pending Orders', url: '/orders', linkProps: { queryParams: { status: 'pending' } }, icon: 'nav-icon-bullet' },
      { name: 'Processing Orders', url: '/orders', linkProps: { queryParams: { status: 'processing' } }, icon: 'nav-icon-bullet' },
      { name: 'Shipped Orders', url: '/orders', linkProps: { queryParams: { status: 'shipped' } }, icon: 'nav-icon-bullet' },
      { name: 'Delivered Orders', url: '/orders', linkProps: { queryParams: { status: 'delivered' } }, icon: 'nav-icon-bullet' },
      { name: 'Cancelled / Returned', url: '/orders', linkProps: { queryParams: { status: 'cancelled' } }, icon: 'nav-icon-bullet' },
    ],
  },
  {
    name: 'Customers',
    url: '/customers',
    iconComponent: { name: 'cilPeople' },
    children: [
      { name: 'Customers', url: '/customers', icon: 'nav-icon-bullet' },
      // { name: 'Customer Groups', url: '/customers/groups', icon: 'nav-icon-bullet' },
      // { name: 'Customer Addresses', url: '/customers/addresses', icon: 'nav-icon-bullet' },
    ],
  },

  { name: 'Storefront', title: true },
  {
    name: 'Home Management',
    url: '/home-page',
    iconComponent: { name: 'cilHome' },
    children: [
      { name: 'Overview', url: '/home-page', icon: 'nav-icon-bullet' },
      { name: 'Hero Banner', url: '/home-page/hero', icon: 'nav-icon-bullet' },
      { name: 'Shop By Category', url: '/home-page/categories', icon: 'nav-icon-bullet' },
      { name: 'Explore Collections', url: '/home-page/collections', icon: 'nav-icon-bullet' },
      { name: 'Best Sellers', url: '/home-page/best-sellers', icon: 'nav-icon-bullet' },
      // { name: 'Promotional Sections', url: '/home-page/promotions', icon: 'nav-icon-bullet' },
      // { name: 'Testimonials', url: '/home-page/testimonials', icon: 'nav-icon-bullet' },
      { name: 'Community Section', url: '/home-page/community', icon: 'nav-icon-bullet' },
      // { name: 'Newsletter Section', url: '/home-page/newsletter', icon: 'nav-icon-bullet' },
    ],
  },
  {
    name: 'Marketing',
    url: '/marketing/coupons',
    iconComponent: { name: 'cilBullhorn' },
    children: [
      { name: 'Coupons', url: '/marketing/coupons', icon: 'nav-icon-bullet' },
      { name: 'Discounts', url: '/marketing/discounts', icon: 'nav-icon-bullet' },
      // { name: 'Promotions', url: '/marketing/promotions', icon: 'nav-icon-bullet' },
      // { name: 'Banners', url: '/marketing/banners', icon: 'nav-icon-bullet' },
      // { name: 'Featured Products', url: '/marketing/featured-products', icon: 'nav-icon-bullet' },
    ],
  },

  { name: 'Support', title: true },
  {
    name: 'Helpdesk',
    url: '/helpdesk',
    iconComponent: { name: 'cilHeadphones' },
    children: [
      // { name: 'Support Tickets', url: '/helpdesk', icon: 'nav-icon-bullet' },
      { name: 'Contact Messages', url: '/contact-messages', icon: 'nav-icon-bullet' },
      // { name: 'FAQ', url: '/faq', icon: 'nav-icon-bullet' },
      // { name: 'Support Categories', url: '/helpdesk/categories', icon: 'nav-icon-bullet' },
    ],
  },

  { name: 'Insights', title: true },
  // {
  //   name: 'Reports',
  //   url: '/reports/sales',
  //   iconComponent: { name: 'cilChartPie' },
  //   children: [
  //     { name: 'Sales Report', url: '/reports/sales', icon: 'nav-icon-bullet' },
  //     { name: 'Product Report', url: '/reports/products', icon: 'nav-icon-bullet' },
  //     { name: 'Customer Report', url: '/reports/customers', icon: 'nav-icon-bullet' },
  //     { name: 'Order Report', url: '/reports/orders', icon: 'nav-icon-bullet' },
  //     { name: 'Inventory Report', url: '/reports/inventory', icon: 'nav-icon-bullet' },
  //   ],
  // },
  {
    name: 'Settings',
    url: '/settings',
    iconComponent: { name: 'cilSettings' },
    children: [
      { name: 'Store Settings', url: '/settings', linkProps: { queryParams: { tab: 'general' } }, icon: 'nav-icon-bullet' },
      { name: 'Payment Settings', url: '/settings', linkProps: { queryParams: { tab: 'payment' } }, icon: 'nav-icon-bullet' },
      { name: 'Shipping Settings', url: '/settings', linkProps: { queryParams: { tab: 'shipping' } }, icon: 'nav-icon-bullet' },
      // { name: 'Tax Settings', url: '/settings', linkProps: { queryParams: { tab: 'tax' } }, icon: 'nav-icon-bullet' },
      // { name: 'Notification Settings', url: '/settings', linkProps: { queryParams: { tab: 'notifications' } }, icon: 'nav-icon-bullet' },
      { name: 'Admin Profile', url: '/settings', linkProps: { queryParams: { tab: 'profile' } }, icon: 'nav-icon-bullet' },
    ],
  },
];
