const pub = [
  {
    path: '/home',
    component: () => import('@/views/pub/home/index'),
    name: 'home',
    meta: {
      title: '首页'
    }
  },
  {
    path: '/pub/user',
    component: () => import('@/views/pub/user/index'),
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
    path: '/pub/video',
    component: () => import('@/views/pub/video/index'),
    name: 'video',
    meta: {
      title: '视频教程'
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
  },
  {
    path: '/pub/myNotice',
    component: () => import('@/views/pub/notice/myNotice'),
    name: 'myNotice',
    meta: {
      title: '教务通知'
    }
  },
  {
    path: '/pub/comment',
    component: () => import('@/views/pub/comment/index'),
    name: 'comment',
    meta: {
      title: '评论回复'
    }
  },
  {
    path: '/pub/watch',
    component: () => import('@/views/pub/watch/index'),
    name: 'watch',
    meta: {
      title: '观看统计'
    }
  }
]
export default pub
