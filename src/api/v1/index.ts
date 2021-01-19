import { get, post } from '@/utils/axios'
import cherrio from 'cheerio'
import { str2Data, str2Modal, detail2Data, comicPic2Data, comicTheme2Data, topicJSON2Data, blogItem2Data } from '@/utils/share'
import { shareIndexComicData, shareIndexData, themeListInterface, shareComicFace, topicResponseInterface, topicItemInterface, readerItemInterface, waifuItem, blogItemInterface, blogResInterface } from '@/interface'
import { createRandomColor } from '@/utils'
import { searchOptions, searchResponseInterface, mirrorItemInterface } from '@/interface/tool'
import querystring from '@/utils/qs'
import { defaultMirrorArr } from '@/const'
import { getMirror, createMirrorStaticFile } from '@/utils/mirror'
import { createStaticByCDN } from '@/utils/map'
import { commentWebviewID } from '@/const/key'

// 点赞某作品
export const loveVoteAlbum = (album_id: string | number)=> {
  album_id = album_id.toString()
  post({
    url: `/ajax/vote_album`,
    data: {
      album_id,
      vote: `likes`
    }
  })
}

// 获取某作品详情
export const getDetail = async (id: string | number): Promise<shareComicFace>=> {
  try {
    const data = await get(`/album/${ id }`)
    return detail2Data(data)
  } catch (error) {
    throw new Error(error)
  }
}

// 获取某作品的所有图片
export const getComicPic = async (id: number | string, page: number | string = 1): Promise<readerItemInterface>=> {
  try {
    // const baseApi = getMirror()
    // const apiMerge = `${ baseApi }/photo/${ id }/?read_mode=read-by-full&page=${ page }`
    // const data = await new Promise(res=> {
    //   uni.request({
    //     url: apiMerge,
    //     success(_res) {
    //       const ctx = _res.data
    //       res(ctx)
    //     },
    //     fail(err) {
    //       console.log(err)
    //       res(false)
    //     }
    //   })
    // })
    // if (!data) throw new Error("接口获取错误")
    const apiMerge = `/photo/${ id }/?read_mode=read-by-full&page=${ page }`
    const data = await get(apiMerge)
    return comicPic2Data(data as string)
  } catch (error) {
    throw new Error(error)
  }
}

// 获取所有主题
export const getTheme = async ()=> {
  try {
    const data = await get('/theme')
    return comicTheme2Data(data)
  } catch (error) {
    throw new Error(error)
  }
}

// 获取热门主题
export const getPopularThemes = async ()=> {
  try {
    const data = await get('/')
    const $ = cherrio.load(data)
    const arr = $('.col-lg-2.col-md-3.cloud.hidden-xs.hidden-sm a')
    const lists: themeListInterface[] = Array.from(arr).map(item=> {
      const ele = cherrio(item)
      const api = ele.attr('href') || ""
      const text = ele.text().trim()
      const bg = createRandomColor()
      const obj: themeListInterface = {
        url: api,
        text,
        bg
      }
      return obj
    })
    return lists
  } catch (error) {
    throw new Error(error)
  }
}

// 获取首页数据
export const getIndexData = async (): Promise<shareIndexData>=>{
  try {
    const data = await get('/')
	console.log(1)
    const $ = cherrio.load(data)
	const billboard = $("#billboard-modal")
	console.log(billboard)
	console.log(2)
    const modal = str2Modal($)
	console.log(3)
    // let cards = $('.row.col-lg-10.col-md-9')
    let cards = $('.col-lg-10.col-md-9')
    let lists: shareIndexComicData[] = Array.from(cards).map(item=> {
      let obj: shareIndexComicData = {
        title: '',
        lists: []
      }
      obj.title = $(item).find('h4').text().trim()
      let cItem = $(item).find('.well.well-sm')
      let lists = Array.from(cItem).map(item=> str2Data(item))
      obj.lists = lists
	  console.log(obj)
      return obj
    })
    const result: shareIndexData = {
      modal,
      lists
    }
    return result
  } catch (error) {
	  console.error(error)
    throw new Error(error)
  }
}

// 节点转为`text`
const node2text = (x: any): string => cherrio(x).text().trim()

// 搜索
export const getSearch = async (qs: string, options: searchOptions): Promise<searchResponseInterface>=> new Promise(async res=>{
  let result: shareComicFace[] = []
  let search_key = ''
  let current_page = options.page
  let total_page = 1
  let total = ''
  let isNext = false
  try {
    const api = querystring.mergeQueryString(qs, options)
    const data = await get(api)
    const $ = cherrio.load(data)
    const qsEle = cherrio($('.col-xs-12.col-md-9.col-sm-8 .well.well-sm')[0])
    const eles = qsEle.find('span.text-white')
    search_key = node2text(eles[0])
    // total_page = +node2text(eles[2])
    const selectEles = $('.col-xs-12.col-md-9.col-sm-8 .visible-xs .pagination.pagination-lg li select').parent()
    const temp_curr = +selectEles.find('select option[selected]').text().trim() 
    const temp_last = +selectEles.find('select').children().last().text().trim()
    if (temp_curr) current_page = temp_curr
    if (temp_last) total_page = temp_last
    if (current_page == total_page) isNext = false
    if (current_page < total_page) isNext = true
    total = node2text(eles[3])
    const lists = $('.col-xs-6.col-sm-6.col-md-4.col-lg-3.list-col')
    result = Array.from(lists).map(item=> str2Data(item))
  } catch (error) {
    console.error(error)
  }
  res({
    isNext,
    search_key,
    current_page,
    total_page,
    total,
    lists: result
  })
})

interface topicItemResInterface {
  items: topicItemInterface[],
  isEnd: boolean
}

/**
 * 获取留言区内容
 */
export const getForumMore = async (page: number | string = 1): Promise<topicItemResInterface>=> {
  const x = { isEnd: true, items: [] }
  try {
    const data: topicResponseInterface = await post({
      url: '/ajax/forum_more',
      data: {
        page,
      },
      contentType: 'form'
    })
    const { message } = data
    if (message == null) {
      return x
    }
    const result = message.map(item=> topicJSON2Data(item))
    // debugger
    return {
      items: result,
      isEnd: false
    }
  } catch (error) {
    console.error(error)
    return x
  }
}

/**
 * 获取所有镜像站
 * 2020-07-03 flag: 使用 `github-issues` 来替代
 * 参考: https://developer.atlassian.com/cloud/trello/rest/#api-boards-id-get
 */
export const getAllMirror = async (): Promise<mirrorItemInterface[]>=> {
  return defaultMirrorArr
  // try {
  //   const data = await get(`https://api.trello.com/1/boards/${ trello_board_id }`)
  //   const { desc } = data
  //   const _lists = rawMirror2DataLists(desc)
  //   if (_lists.length == 0) return defaultMirrorArr
  // } catch (error) {
  //   return defaultMirrorArr
  // }
}

/**
 * 测试链接是否可用
 */
export const handleTestApi = async (url: string): Promise<boolean> => new Promise(_res=> {
  uni.request({
    url,
    success: res=> {
      _res(true)
    },
    fail: (err)=> {
      _res(false)
    }
  })
  return true
})

/**
 * 登录接口
 */
export interface loginInterface {

  /**
   * 账号
   */
  username: string

  /**
   * 密码
   */
  password: string

  /**
   * 提交登录
   */
  submit_login?: string
}

/**
 * 登录
 * @param data 登录数据
 */
export const handleLogin = async (data: loginInterface): Promise<string> => {
  try {
    Object.assign(data, {
      submit_login: ""
    })
    const _r = Date.now()
    const token: string = await new Promise(res=> {
      console.log("发起请求..")
      uni.request({
        url: `${ getMirror() }/login?t=${ _r }`,
        data,
        withCredentials: false,
        header: {
          "cookie": "ipcountry=CN;",
          "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36"
        },
        success(_res) {
          const { header } = _res
          let result
          try {
            const _header = header
            if (!('Set-Cookie' in _header)) return res("")
            const _cookie: string = _header['Set-Cookie']
            const _index: number = _cookie.search("ipm5")
            if (_index >= 0) {
              const _data = _cookie.substring(_index)
              const _arr = _data.split(';')
              const _result = _arr[0].split('=')[1]
              result = _result
            }
          } catch (error) {
            result = ""
            console.log('登录返回的错误信息: ', error);
          }
          res(result)
        },
        fail(err) {
          const msg = err.errMsg
          console.log('登录失败: ', msg);
          res("")
        }
      })
    })
    return token
  } catch (error) {
    throw new Error(error)
  }
  // plus.webview.currentWebview().evalJS(``)
  // try {
  //   const webviewID = "18comic_login_webview"
  //   const loginURL = "https://18comic2.biz/login"
  //   const webviewStyle: PlusWebviewWebviewStyles = {
  //     cachemode: "noCache",
  //     dock: 'top',
  //     // height: `${ 420 }px`,
  //     top: `${ 240 }px`,
  //     // bottom:'0px',
  //   }
  //   const webview = plus.webview.open(loginURL, webviewID, webviewStyle, "", 200, ()=> {
  //     webview.evalJS(`alert("fuck you")`)
  //     webview.evalJS(`$("#login_username").val("${ username }")`)
  //     webview.evalJS(`$("#login_password").val("${ password }")`)
  //   })
  //   webview.evalJS(`console.log('are you ok??')`)
  // } catch (error) {
  //   throw new Error(error)
  // }
  // return
}

/**
 * 获取老婆们
 */
export const getWaifuer = async (): Promise<waifuItem[]>=> {
  try {
    const url = createStaticByCDN(`waifu/data.json`)
    console.log('url: ', url);
    const data = await get(url)
    return data
  } catch (error) {
    console.error(error)
    return []
  }
}

/**
 * 获取 `blog`
 */
export const getBlog = async (page: number | string = 1): Promise<blogResInterface>=> {
  const res = await get(`/blogs?page=${ page }`)
  const $ = cherrio.load(res)
  const lists: blogItemInterface[] = Array.from($('.col-md-12')).map(item=> blogItem2Data(item))
  const active = $('.hidden-xs .pagination .active')
  const next = Array.from(active.next())
  const isNext = next.length >= 1
  return {
    isNext,
    lists
  }
}

/**
 * 创建 `css` 链接
 */
const createCssLink = (src: string): string=> {
  return `<link rel="stylesheet" href="${ src }">`
}

const prefixImgUrl = ($: any)=> {
  $('img').each((index, ele)=> {
    const oldSrc = $(ele).attr("src") || ""
    $(ele).attr("src", createMirrorStaticFile(oldSrc))
  });
}

/**
 * 获取漫画评论
 */
export const getComicComment = async (id: string | number, page = 1): Promise<string>=> {
  try {
    const data = await post({
      url: `/ajax/album_pagination`,
      data: {
        video_id: +id,
        page,
        series: 1,
      },
      contentType: `form`
    })
    const r = (data as string)
    if (page == 1) {
      const $ = cherrio.load(``)
      const color = createMirrorStaticFile(`templates/frontend/airav/css/colors.css?v=122020000824-1`)
      const style = createMirrorStaticFile(`templates/frontend/airav/css/style.css?v=2020000824-1`)
      // TODO: 尝试引入 CDN 链接...
      const bootstrap = createMirrorStaticFile(`templates/frontend/airav/css/bootstrap.css?v=2020000824-1`)
      $('head').append(`<meta content="width=device-width, initial-scale=1" name="viewport">`)
      $('head').append(`<script src="https://cdn.jsdelivr.net/npm/jquery"></script>`)
      $('head').append(createCssLink(bootstrap), createCssLink(color), createCssLink(style))
      const backText = "返回"
      const backID = "close"
      $('body').append(`
      <div id="Comic_Top_Nav" class="navbar navbar-inverse navbar-fixed-top" role="navigation">
        <div class="container">
          <div class="navbar-header">
            <a href="#" id="${ backID }" class="btn btn-primary navbar-btn m-l-15 m-r-15">
             ${ backText }
            </a>
          </div>
        </div>
      </div>
      `)
      $('body').append(`
        <div class="tab-pane m-b-15 active" id="comments"></div>
      `)
      $('#comments').append(r)
      prefixImgUrl($)
      const checkText = "查看更多"
      // api: http://www.html5plus.org/doc/zh_cn/xhr.html
      $('body').append(`
        <script type="text/javascript">
          window.page = 2
          window.id = "${ id }"
          $('a').click(function(e) {
            const nextText = $(this).text().trim()
            if (nextText == "${ checkText }") {
              $(this).attr("id", "runtime-id")
              try {
                const url = "https://x.dev?id=${ id }&page=" + page
                let a = document.createElement("a")
                a.href = url
                a.click()
              } catch (error) {
                throw new Error(error)
              }
            }
            e.stopPropagation();
            e.preventDefault();
            return false
          })
          $('#${ backID }').click(function(e) {
            try {
              const current = plus.webview.getWebviewById("${ commentWebviewID }")
              current.close()
              return false
            } catch (error) {
              throw new Error(error)
            }
          })
        </script>
      `)
      return $.html()
    } else {
      const append = cherrio.load(r, {
        xmlMode: true
      })
      prefixImgUrl(append)
      return append.html()
    }
  } catch (error) {
    throw new Error(error)
  }
}