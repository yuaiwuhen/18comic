import { colorItemInterface, themeMenuItemInterface, devInsDataInterface, guideDataItemInterface, mirrorItemInterface } from '@/interface/tool'
import { createStaticByCDN } from '@/utils/map'

const injection = require('@/plugins/injection')

/********
> TODO 将所有的公共 `key` 移植到 `key.ts` 中
*******/

/**
 * 滤镜默认背景
 */
export let blur_default_url = "https://i.loli.net/2020/05/25/ynGRv1z5s7OCtw9.png"

blur_default_url = createStaticByCDN('resources/tiny_blur.png')

export let empty_default_url = "https://i.loli.net/2020/06/09/LnB24yeIwxs8p1g.png"

empty_default_url = createStaticByCDN('resources/empty.png')

/**
 * `18comic` logo
 * raw url: https://18comic.vip/static/resources/images/Cover/%E5%A4%A9%E5%A0%82.jpg
 */
export const ng18comicLogo = createStaticByCDN('resources/18comic.jpg')

/**
 * 主题默认列
 */
export const theme_default_col = 3

/**
 * 主题默认的最大文字(将会变为 `2` 列)
 */
export const theme_item_max_word = 8

/**
 * 设置里的开发者相关默认最大点击次数
 * 才会打开开发者相关功能
 */
export const settings_click_max_count = 8


/**
 * 默认背景
 */
export const bg_default_url = "http://www.dmoe.cc/random.php"

/**
 * 搜索界面数据为空时的文字
 */
export const search_empty_text = "没有数据哦"

/**
 * 主题搜索区 `placeholder`
 */
export const theme_search_main_placeholder = 'bilibili干杯🍻, 请搜索'

/**
 * goto id-input
 */
export const theme_search_goto_placeholder = '请输入id'

export const theme_search_goto_text = '如果你知道某个作品的id话....'

/**
 * 历史记录的最大长度
 * 20200715 修改为 `240`..
 */
export const history_views_max_length = 240

/**
 * 我的邮箱
 */
export let my_email = ""
try {
  my_email = atob(`Y2hlbmhvbnpob3VAZ21haWwuY29t`)
} catch (err) {
  console.error("base64解码失败: ", err)
}

/**
 * 官方的 `trello` 的 `id`
 */
export const trello_board_id =  'McDZAm8C'

/**
 * 颜色列表
 */
export const colors: colorItemInterface[] = [
  {
    title: "嫣红",
    name: "red",
    color: "#e54d42"
  },
  {
    title: "桔橙",
    name: "orange",
    color: "#f37b1d"
  },
  {
    title: "明黄",
    name: "yellow",
    color: "#fbbd08"
  },
  {
    title: "橄榄",
    name: "olive",
    color: "#8dc63f"
  },
  {
    title: "森绿",
    name: "green",
    color: "#39b54a"
  },
  {
    title: "天青",
    name: "cyan",
    color: "#1cbbb4"
  },
  {
    title: "海蓝",
    name: "blue",
    color: "#0081ff"
  },
  {
    title: "姹紫",
    name: "purple",
    color: "#6739b6"
  },
  {
    title: "木槿",
    name: "mauve",
    color: "#9c26b0"
  },
  {
    title: "桃粉",
    name: "pink",
    color: "#e03997"
  },
  {
    title: "棕褐",
    name: "brown",
    color: "#a5673f"
  },
  {
    title: "玄灰",
    name: "grey",
    color: "#8799a3"
  },
  {
    title: "草灰",
    name: "gray",
    color: "#aaaaaa"
  },
  {
    title: "墨黑",
    name: "black",
    color: "#333333"
  },
  {
    title: "雅白",
    name: "white",
    color: "#ffffff"
  }
]

/**
 * 主题菜单
 */
export const theme_menus: themeMenuItemInterface[] = [
  {
    title: "GOTO",
    link: 'detail/index',
    key: 'goto',
  },
  {
    title: "随机看",
    link: 'detail/index',
    key: 'random_comic',
  },
  {
    title: "留言板",
    link: 'topic/index',
    key: 'bbs',
  },
  {
    title: "涨姿势",
    link: 'blogs/index',
    key: 'blogs'
  },
  // TODO 2020-08-28
  // 我陈某就是死, 从这里跳下去, 我也不会做这个功能(flag已立)
  // {
  //   title: '插件开发',
  //   link: 'webview/index',
  //   key: 'plugin_development'
  // }
]

/**
 * 创建提示性`文字`
 */
const createSpanTips = (ctx: string): string=> {
  return `<span style="color: #e03997">\`${ ctx }\`</span>`
}

export const guideDatas: guideDataItemInterface[] = [
  {
    title: '作者寄语🔞',
    content: `完全免费! 代码开源, 没有多余套路. 所有数据均来自网络, 侵权必删, ${ createSpanTips('仅供学习参考') }, 如果一直访问不了, 请尝试切换镜像站`,
  },
  {
    title: '警告🔞',
    content: `前方高能!!!\n部分内容可能对您的生理及心理造成难以恢复的伤害。本应用作者不会对由本应用造成的任何后果负责。\n\n未成年人应在监护人指导下使用本应用。`,
    isEnd: true
  },
]

/**
 * QQ群
 */
export const joinQQGroup = "https://jq.qq.com/?_wv=1027&k=KaVypDjS"

/**
 * 注入的 `pages.json` 文件
 */
export const devInsData: devInsDataInterface = injection.pagejson

/**
 * 2020-08-27 更新
 * 网址发布页: http://jmcomic.xyz
 */

/*

JM主站
https://18comic.vip

海外分流
https://18comic.org

中國用戶 〈有新網址會隨時更新〉

JM中國主站
https://18comic1.biz

分流1
https://18comic2.biz

分流2
https://18comic3.biz

*/
export const defaultMirrorArr: mirrorItemInterface[] = [
  {
    title: 'JM主站',
    ext: 'vip',
    full_url: 'https://18comic.vip'
  },
  {
    title: '海外分流',
    ext: 'org',
    full_url: 'https://18comic.org'
  },
  {
    title: 'JM中國主站',
    ext: 'fun',
    full_url: 'https://18comic1.biz'
  },
  {
    title: "分流1",
    ext: "biz",
    full_url: "https://jkfan.cn/comic"
  },
  {
    title: "分流2",
    ext: "biz",
    full_url: "http://ccd.lizhanqi.top?src=http://hipotiroidismo.site"
  }
]

/**
 * 更新版本是最新版本
 */
export const updateIsLastVersion = `已经是最新版本了`

/**
 * 更新版本网络连接错误
 */
export const updateVersionNetWorkError = `更新版本失败, 可能是网络问题(需要翻墙)`

/**
 * 重新加载按钮的文字
 */
export const reloadButtonText = `刷新(*╹▽╹*)`

/**
 * 详情id不存在
 */
export const detailIDNotExist = `该漫画不存在`

/**
 * 开源地址
 */
export const openSourceRepo = `https://github.com/waifu-project/18comic`