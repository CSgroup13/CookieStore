import SvgColor from '../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
  {
    title: 'dashboard',
    path: '/adminDashboard',
    icon: icon('ic_analytics'),
  },
  {
    title: 'users',
    path: '/adminUsers',
    icon: icon('ic_user'),
  },
  {
    title: 'products',
    path: '/adminProducts',
    icon: icon('ic_cart'),
  },
  {
    title: 'orders',
    path: '/adminOrders',
    icon: icon('ic_analytics'),
  },
];

export default navConfig;
