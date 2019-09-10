import Mock from 'mockjs'
import store from '../store'

// 拦截活跃用户请求并返回相关数据
Mock.mock('/users/active', 'get', () => {
    let articles = store.getters.computedArticles
    let comments = []
    let usersObj = {}

    // 活跃用户
    let activeUsers = []

    // 汇集用户所有文章的所有评论
    articles.map((article) => {
        const articleComments = Array.isArray(article.comments) ? article.comments : []
        // 合并评论，等价于 comments = comments.concat(articleComments)
        comments = [...comments, ...articleComments]
    })

    // 用对象形式，以用户（唯一）名分组，统计用户出现的次数
    // 多值化一reduce 统计用户发布评论的数量，并返回包含头像和数量的对象
    // {{uname:{avatar:'zhansan',num:3}}, {uname:{avatar:'lisi',num:7}}}
    usersObj = comments.reduce((accumulator, currentValue) => {
        accumulator[currentValue.uname] = accumulator[currentValue.uname] || {}
        accumulator[currentValue.uname].avatar = currentValue.uavatar
        accumulator[currentValue.uname].num = ++accumulator[currentValue.uname].num || 1
        return accumulator
    }, {})

    // 对象化数组 将统计后的数据放入一个数组
    for (const [key, value] of Object.entries(usersObj)) {
        activeUsers.push({
            name: key,
            avatar: value.avatar,
            num: value.num
        })
    }

    // 依据评论数排名
    activeUsers.sort((a, b) => b.num - a.num)
    // 取前8项用户数据
    activeUsers = activeUsers.slice(0, 8)

    return activeUsers
})


// 拦截最热文章POST请求，返回相关数据
Mock.mock('/articles/hot', 'post', (options) => {
    let filteredArticles = store.getters.getArticlesByFilter('noreply')
    // 将评论最多的文章放在前面
    let articles = filteredArticles.reverse()

    // 取7天内评论最多的文章
    let hotArticles = articles.filter((article) => (new Date() - new Date(article.date) < 604800000))
    let num
    if (options.body) {
        try {
            num = JSON.parse(options.body).num
        } catch (e) {
            // 
        }
    }

    hotArticles = hotArticles.splice(0, num || 10)
    
    return hotArticles
})