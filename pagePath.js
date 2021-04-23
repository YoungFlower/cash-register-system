
let pages =[
    // pages数组中第一项表示应用启动页，参考：https://uniapp.dcloud.io/collocation/pages
    {
        "path": "pages/tabBar/index/index",
        "style": {
            "enablePullDownRefresh": true,
            "navigationStyle": "custom"
        }

    },
    {
        "path": "pages/tabBar/mine/mine",
        "style": {
            "enablePullDownRefresh": true,
            "navigationStyle": "custom"
        }

    },

    {
        "path": "pages/locationCity/locationCity",
        "style": {
            "navigationBarTitleText": "所在城市",
            "enablePullDownRefresh": false
        }

    },

    {
        "path": "pages/applyList/applyList",
        "style": {
            "enablePullDownRefresh": true,
            "navigationStyle": "custom"
        }
    },
    {
        "path": "pages/applyResult/applyResult",
        "style": {
            "enablePullDownRefresh": true,
            "navigationStyle": "custom"
        }
    },
    {
        "path": "pages/baseInfo/baseInfo",
        "style": {
            "enablePullDownRefresh": true,
            "navigationBarBackgroundColor":"#F7F8F8",
            "navigationBarTitleText": "简历完善"
        }
    },
    {
        "path": "pages/citySelect/citySelect",
        "style": {
            "enablePullDownRefresh": false,
            "navigationBarTitleText": "选择城市"
        }

    },
    {
        "path": "pages/collection/collection",
        "style": {
            "enablePullDownRefresh": true,
            "navigationStyle": "custom"
        }
    },
    {
        "path": "pages/employerInfo/employerInfo",
        "style": {
            "enablePullDownRefresh": true,
            "navigationStyle": "custom"
        }
    },
    {
        "path": "pages/jobDetail/jobDetail",
        "style": {
            "enablePullDownRefresh": true
        }
    },
    {
        "path": "pages/jobList/jobList",
        "style": {
            "enablePullDownRefresh": true,
            "navigationStyle": "custom"
        }
    },
    {
        "path": "pages/limitInfo/limitInfo",
        "style": {
            "enablePullDownRefresh": true,
            "navigationStyle": "custom"
        }
    },
    {
        "path": "pages/recommendList/recommendList",
        "style": {
            "enablePullDownRefresh": true,
            "navigationStyle": "custom"
        }
    },
    {
        "path": "pages/search/search",
        "style": {
            "enablePullDownRefresh": true,
            "navigationStyle": "custom"
        }
    },
    {
        "path": "pages/setting/setting",
        "style": {
            "enablePullDownRefresh": true,
            "navigationStyle": "custom"
        }
    },
    {
        "path": "pages/uploadDocuments/uploadDocuments",
        "style": {
            "enablePullDownRefresh": true,
            "navigationStyle": "custom"
        }
    },
    {
        "path": "pages/webView/webView",
        "style": {
            "enablePullDownRefresh": true,
            "navigationStyle": "custom"
        }
    },
    {
        "path": "pages/featurePost/featurePost",
        "style": {
            "enablePullDownRefresh": true,
            "navigationStyle": "custom"
        }
    }
]
pages.forEach(item=>{

})
const jianzhike = {
    index:{path:'pages/tabBar/index/index',name:'index',title:'首页'},
    mine:{path:'pages/tabBar/mine/mine',name:'mine',title:'我的'},
    locationCity:{path:'pages/locationCity/locationCity',name:'locationCity',title:'所在城市'},
}

export default jianzhike
