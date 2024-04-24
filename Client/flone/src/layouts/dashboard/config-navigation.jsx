import SvgColor from '../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={process.env.PUBLIC_URL + `/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
  {
    title: 'dashboard',
    path: process.env.PUBLIC_URL+'/adminDashboard',
    icon: icon('ic_analytics'),
  },
  {
    title: 'users',
    path: process.env.PUBLIC_URL+'/adminUsers',
    icon: icon('ic_user'),
  },
  {
    title: 'products',
    path: process.env.PUBLIC_URL+'/adminProducts',
    icon: icon('ic_cart'),
  },
  {
    title: 'orders',
    path: process.env.PUBLIC_URL+'/adminOrders',
    icon: icon('ic_analytics'),
  },
  {
    title: 'Back to store',
    path: process.env.PUBLIC_URL+'/',
    icon: icon('ic_go_back'),
  },
];

export default navConfig;
