import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/views/Main'
import Login from '@/views/Login'

// 设备列表
import EquipmentList from '@/views/equipment/list'
// 设备详情 yes
import EquipmentDetails from '@/views/equipment/details'
// 设备地图
import EquipmentMap from '@/views/equipment/map'
// 设备统计
import EquipmentStatistic from '@/views/equipment/statistic'
// 数据研判
import DataAnalysis from '@/views/analysis/analysis'
// 普库列表
import DatabaseList from '@/views/database/list'
// 谱库详情
import DatabaseInfo from '@/views/database/info'

// 谱库升级
import DatabaseUpgrade from '@/views/database/upgrade'
// 企业管理
import CompanyManage from '@/views/company/manage'
// 企业关联设备管理
import CompanyRelevance from '@/views/company/relevance'
// 角色管理
import UserRole from '@/views/user/authority'
// 管理员账号管理
import UserAdmin from '@/views/user/admin'
// 版本管理
import VersionsManage from '@/views/versions/manage'
// 关于我们
import AboutUs from '@/views/about/us'
// 身份信息
import IdCardInfo from '@/views/card/card'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/main',
      name: 'Main',
      component: Main,
      meta:{
        requireAuth: true
      },
      children: [
        {
          path: '/equipmentList',
          name: 'EquipmentList',
          component: EquipmentList,
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/equipmentDetails',
          name: 'EquipmentDetails',
          component: EquipmentDetails,
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/equipmentMap',
          name: 'EquipmentMap',
          component: EquipmentMap,
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/equipmentStatistic',
          name: 'EquipmentStatistic',
          component: EquipmentStatistic,
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/dataAnalysis',
          name: 'DataAnalysis',
          component: DataAnalysis,
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/databaseList',
          name: 'DatabaseList',
          component: DatabaseList,
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/databaseInfo',
          name: 'DatabaseInfo',
          component: DatabaseInfo,
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/databaseUpgrade',
          name: 'DatabaseUpgrade',
          component: DatabaseUpgrade,
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/companyManage',
          name: 'CompanyManage',
          component: CompanyManage,
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/companyRelevance',
          name: 'CompanyRelevance',
          component: CompanyRelevance,
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/userRole',
          name: 'UserRole',
          component: UserRole,
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/userAdmin',
          name: 'UserAdmin',
          component: UserAdmin,
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/versionsManage',
          name: 'VersionsManage',
          component: VersionsManage,
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/aboutUs',
          name: 'aboutUs',
          
          component: AboutUs,
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/idCardInfo',
          name: 'idCardInfo',
          component: IdCardInfo,
          meta: {
            requireAuth: true
          }
        }
      ]
    }
  ]
})
