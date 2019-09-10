export default [{
        path: '/auth/register',
        name: 'Register',
        component: () => import('@/views/auth/Register')
    },
    {
        path: '/',
        name: 'Home',
        alias: '/topics',
        component: () => import('@/views/Home')
    },
    {
        path: '*',
        redirect: '/'
    },
    {
        path: '/auth/login',
        name: 'Login',
        component: () => import('@/views/auth/Login')
    },
    // 编辑资料路由
    {
        path: '/users/1/edit',
        component: () => import('@/views/users/Edit'),
        children: [{
                // 子路由的 path 为空值 ''，表示该页面作为默认子路由
                // 在导航到父级路由（/users/1/edit）时，就开始加载
                path: '',
                name: 'EditProfile',
                component: () => import('@/views/users/Profile'),
                meta: { auth: true }
            },
            {
                path: '/users/1/edit_avatar',
                name: 'EditAvatar',
                component: () => import('@/views/users/Avatar'),
                meta: { auth: true }
            },
            {
                path: '/users/1/edit_password',
                name: 'EditPassword',
                component: () => import('@/views/users/Password.vue'),
                meta: { auth: true }
            }
        ]
    },
    {
        path: '/articles/create',
        name: 'Create',
        component: () => import('@/views/articles/Create'),
        meta: { auth: true }
    },
    {
        path: '/articles/:articleId/content',
        name: 'Content',
        component: () => import('@/views/articles/Content')
    },
    {
        path: '/articles/:articleId/edit',
        name: 'Edit',
        component: () => import('@/views/articles/Create'),
        meta: { auth: true }
    },
    {
        path: '/:user',
        component: () => import('@/views/articles/Column'),
        children: [{
                path: '',
                name: 'Column',
                component: () => import('@/views/articles/List')
            },
            {
                path: '/articles/:articleId/content',
                name: 'Content',
                component: () => import('@/views/articles/Content')
            }
        ]
    },
    {
        path: '/search',
        name: 'Search',
        component: () => import('@/views/Search')
    },
]