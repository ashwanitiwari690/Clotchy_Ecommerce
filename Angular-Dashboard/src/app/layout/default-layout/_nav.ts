import { INavData } from '@coreui/angular';

export const navItemscustomer: INavData[] = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    iconComponent: { name: 'cilHome' },
  },
  {
    title: true,
    name: 'Build'
  },
  {
    name: 'Knowledge Base',
    url: '/knowledge',
    iconComponent: { name: 'cil-Bookmark' }
  },
  {
    name: 'Agents',
    url: '/agents',
    // linkProps: { fragment: 'headings' },
    iconComponent: { name: 'cibProbot' }
  },
  {
    name: 'Requirement',
    title: true
  },
  {
    name: 'DID',
    url: '/did',
    iconComponent: { name: 'cilPhone' }
  },
  {
    name: 'Leads',
    url: '/leads',
    iconComponent: { name: 'cilContact' }
  },
  {
    name: 'System',
    title: true
  },
  {
    name: 'Setting',
    url: '/base',
    iconComponent: { name: 'cil-Settings' },
    children: [
      {
        name: 'API Key',
        url: '/base/accordion',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Payment Transition',
        url: '/base/breadcrumbs',
        icon: 'nav-icon-bullet'
      }
    ]
  },

  {
    name: 'Monitor',
    title: true
  },
  {
    name: 'Reports',
    url: '/base',
    iconComponent: { name: 'cibCampaignMonitor' },
    children: [
      {
        name: 'Accordion',
        url: '/base/accordion',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Breadcrumbs',
        url: '/base/breadcrumbs',
        icon: 'nav-icon-bullet'
      }
    ]
  }

];



export const navItemsadmin: INavData[] = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    iconComponent: { name: 'cilHome' },
  },
   {
    title: true,
    name: 'Permission'
  },
   {
    name: 'Agent Prompt',
    url: '/knowledge',
    iconComponent: { name: 'cil-drop' }
  },
  {
    name: 'Knowledge Base',
    url: '/theme/typography',
    linkProps: { fragment: 'headings' },
    iconComponent: { name: 'cil-pencil' }
  },
  {
    title: true,
    name: 'Management'
  },
  {
    name: 'Manage Users',
    url: '/knowledge',
    iconComponent: { name: 'cil-drop' }
  },
  {
    name: 'DID',
    url: '/theme/typography',
    linkProps: { fragment: 'headings' },
    iconComponent: { name: 'cil-pencil' }
  },
  {
    name: 'Leads',
    url: '/theme/typography',
    linkProps: { fragment: 'headings' },
    iconComponent: { name: 'cil-pencil' }
  },
  {
    name: 'System',
    title: true
  },
  {
    name: 'Setting',
    url: '/base',
    iconComponent: { name: 'cil-Settings' },
    children: [
      {
        name: 'API Key',
        url: '/base/accordion',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Payment Transition',
        url: '/base/breadcrumbs',
        icon: 'nav-icon-bullet'
      }
    ]
  },
  {
    name: 'Monitor',
    title: true
  },
  {
    name: 'Reports',
    url: '/base',
    iconComponent: { name: 'cibCampaignMonitor' },
    children: [
      {
        name: 'Accordion',
        url: '/base/accordion',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Breadcrumbs',
        url: '/base/breadcrumbs',
        icon: 'nav-icon-bullet'
      }
    ]
  }
];