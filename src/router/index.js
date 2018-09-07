import Vue from 'vue';
import Router from 'vue-router';
import Home from 'components/shareBike/home';
import shopList from 'components/wr/shopList';
import Admin from 'components/shareBike/admin/admin';
import wrAdmin from 'components/wr/admin/admin';
import Monitoring from 'components/shareBike/monitoring/monitoring';
import wrMonitoring from 'components/wr/monitoring/monitoring';
import MonitoringItem from 'components/shareBike/monitoring/monitoringItem';
import Repairs from 'components/shareBike/repairs/repairs';
import IncomeStatistics from 'components/shareBike/incomeStatistics/incomeStatistics';
import Dispatch from 'components/shareBike/dispatch/dispatch';
import DikeIndent from 'components/shareBike/bikeIndent/bikeIndent';
import WrIndent from 'components/wr/bikeIndent/bikeIndent';
import DikeIndentItem from 'components/wr/bikeIndent/dikeIndentItem';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '*',
      redirect: '/shareBike/home'
    },
    {
      path: '/shareBike/home',
      name: 'home',
      component: Home
    },
    {
      path: '/wr/shopList',
      name: 'shopList',
      component: shopList
    },
    {
      path: '/shareBike/admin',
      name: 'admin',
      component: Admin
    },
    {
      path: '/wr/admin',
      name: 'wradmin',
      component: wrAdmin
    },
    {
      path: '/shareBike/monitoring',
      name: 'monitoring',
      component: Monitoring
    },
    {
      path: '/wr/monitoring',
      name: 'wrmonitoring',
      component: wrMonitoring
    },
    {
      path: '/shareBike/monitoring/:id',
      name: 'monitoringItem',
      component: MonitoringItem
    },
    {
      path: '/shareBike/repairs',
      name: 'repairs',
      component: Repairs
    },
    {
      path: '/shareBike/IncomeStatistics',
      name: 'incomeStatistics',
      component: IncomeStatistics
    },
    {
      path: '/shareBike/dispatch',
      name: 'dispatch',
      component: Dispatch
    },
    {
      path: '/shareBike/bikeIndent',
      name: 'bikeIndent',
      component: DikeIndent
    },
    {
      path: '/shareBike/bikeIndentItem',
      name: 'bikeIndentItem',
      component: DikeIndentItem
    },
    {
      path: '/wr/bikeIndent',
      name: 'WrIndent',
      component: WrIndent
    }
  ]
});
