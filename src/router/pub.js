const pub = [
  {
    path: '/pub/user',
    component: () => import('@/views/pub/user/testEdit'),
    name: 'user',
    meta: {
      title: '用户信息'
    }
  },
  {
    path: '/pub/information',
    component: () => import('@/views/pub/information/index'),
    name: 'information',
    meta: {
      title: '学籍信息'
    }
  },
  {
    path: '/pub/achievement',
    component: () => import('@/views/pub/achievement/index'),
    name: 'achievement',
    meta: {
      title: '成绩查询'
    }
  },
  {
    path: '/pub/visualization',
    component: () => import('@/views/pub/visualization/index'),
    name: 'visualization',
    meta: {
      title: '数据统计'
    }
  },
  {
    path: '/pub/study',
    component: () => import('@/views/pub/study/index'),
    name: 'study',
    meta: {
      title: '网课学习'
    }
  },
  {
    path: '/pub/upload',
    component: () => import('@/views/pub/upload/index'),
    name: 'upload',
    meta: {
      title: '资料上传'
    }
  },
  {
    path: '/pub/course',
    component: () => import('@/views/pub/course/index'),
    name: 'course',
    meta: {
      title: '课表查询'
    }
  },
  {
    path: '/pub/notice',
    component: () => import('@/views/pub/notice/index'),
    name: 'notice',
    meta: {
      title: '教务通知'
    }
  }
]
export default pub
