let songs = [
    {
        name:"传奇",
        singer:"王菲",
    },
    {
        name:"吴哥窟",
        singer:"吴雨霏",
    },
    {
        name:"恋曲1990",
        singer:"罗大佑"

    },
    {
        name:"明年今日",
        singer:"陈奕迅"
    },
    {
        name:"再见二丁目",
        singer:"杨千嬅"
    },
    {
        name:"你还要我怎样",
        singer:"薛之谦"
    },
]
const audio = e(".audioPlayer")
//点击收藏
const favorite = () => {
    var heart = e(".favorite")
    heart.addEventListener("click", function() {
        heart.classList.toggle("pink")
    })
}
//定义rjust函数
const rjust = (str, size, delimeter="0") => {
    var result = str
    while (result.length < size) {
        result = delimeter + result
    }
    return result
}
//格式化当前时间
const formatTime = sum => {
    var minutes = String(Math.floor(sum % 3600 / 60))
    var second =  String(Math.floor(sum % 60))
    var time = `${rjust(minutes, 2)}:${rjust(second, 2)}`
    return time
}
const showTime = () => {
    var currentTime = e(".currentTime")
    var sum = audio.currentTime
    var value = formatTime(sum)
    currentTime.innerHTML = value
    var input = Math.floor(sum / audio.duration *100)
    if (Boolean(input)) {
        e(".range").value = input
    }
}
//显示当前时间
const currentTime = () => {
    audio.addEventListener("timeupdate", showTime)
}
//显示总时长
const totalTime = () => {
    var endTime = e(".endTime")
    //canplay是audio加载完成音乐文件后产生的事件，在里面才能读取duration属性
    audio.addEventListener("canplay", function() {
        var duration = parseInt(audio.duration)
        var time = formatTime(duration)
        //模板字符串
        endTime.innerHTML = time
    })
}
//给input range 添加拖动事件
const bindRange = () => {
    e(".range").addEventListener("input", () => {
        audio.removeEventListener("timeupdate", showTime)
        var value = e(".range").value
        //拖动后显示当前时间
        audio.currentTime = value / 100 * audio.duration
        currentTime()
    })
}
//播放&&暂停功能
const playPause = () => {
    var play = e(".play")
    var currentTime = e(".currentTime")
    play.addEventListener("click", function() {
        if (!play.classList.contains("on")){
            audio.play()
            play.innerHTML = "▐▐"
            play.classList.add("on")
        } else if (play.classList.contains("on")) {
            audio.pause()
            play.innerHTML = "▷"
            play.classList.remove("on")
        }
    })
}
//切换音乐和背景函数
const toggleMusic = (className) => {
    var className = "." + className
    var toggle = e(className)
    var play = e(".play")
    var songName = e(".songName")
    var singer = e(".singer")
    var bgBottom = e("#bgBottom")
    var bgTop = e("#bgTop")
    toggle.addEventListener("click", function(event){
        var self = event.target
        //取出上一首/下一首的offset值
        var offset = parseInt(self.dataset.offset)
        var allSongs = parseInt(audio.dataset.all)
        var currentSong = parseInt(audio.dataset.current)
        //下一首的index值
        var nextSong = (currentSong + offset + allSongs ) % allSongs
        audio.dataset.current = nextSong
        var src = "songs/" + nextSong + ".mp3"
        audio.src = src
        audio.play()
        //播放的同时，中间的播放/暂停按钮要切换
        play.innerHTML = "▐▐"
        play.classList.add("on")
        //更改显示的歌名和歌手
        songName.innerHTML = songs[nextSong].name
        singer.innerHTML = songs[nextSong].singer
        //更换背景图
        var url = "img/" + nextSong + ".jpg"
        bgBottom.src = url
        bgTop.src = url
    })
}
//显示列表
const showList = () => {
    var songList = e(".songList")
    var list = e(".list")
    songList.addEventListener("click", function(){
        list.classList.toggle("appear")
        removeClassAll("pink")
        var index = audio.dataset.current
        var listPink = "." + "item-" + index
        e(listPink).classList.add("pink")
    })
}
//列表点歌
const listAction = () => {
    var list = e(".list")
    var play = e(".play")
    var songName = e(".songName")
    var singer = e(".singer")
    var bgBottom = e("#bgBottom")
    var bgTop = e("#bgTop")
    list.addEventListener("click", (event) => {
        var self = event.target
        if (self.classList.contains("item")) {
            removeClassAll("pink")
            self.classList.add("pink")
            var index = self.dataset.index
            audio.dataset.current = index
            var src = "songs/" + index + ".mp3"
            audio.src = src
            audio.play()
            //播放的同时，中间的播放/暂停按钮要切换
            play.innerHTML = "▐▐"
            play.classList.add("on")
            //更改显示的歌名和歌手
            songName.innerHTML = songs[index].name
            singer.innerHTML = songs[index].singer
            //更换背景图
            var url = "img/" + index + ".jpg"
            bgBottom.src = url
            bgTop.src = url

        }
    })
}
//列表循环播放
const loop = function() {
    audio.addEventListener('ended', function() {
        var play = e(".play")
        var songName = e(".songName")
        var singer = e(".singer")
        var bgBottom = e("#bgBottom")
        var bgTop = e("#bgTop")
        var allSongs = parseInt(audio.dataset.all)
        var currentSong = parseInt(audio.dataset.current)
        //下一首的index值
        var nextSong = (currentSong + 1 + allSongs ) % allSongs
        audio.dataset.current = nextSong
        var src = "songs/" + nextSong + ".mp3"
        audio.src = src
        audio.play()
        //播放的同时，中间的播放/暂停按钮要切换
        play.innerHTML = "▐▐"
        play.classList.add("on")
        //更改显示的歌名和歌手
        songName.innerHTML = songs[nextSong].name
        singer.innerHTML = songs[nextSong].singer
        //更换背景图
        var url = "img/" + nextSong + ".jpg"
        bgBottom.src = url
        bgTop.src = url
    })
}

const main = () => {
    favorite()
    currentTime()
    totalTime()
    bindRange()
    playPause()
    //上一首
    toggleMusic("toggleLeft")
    //下一首
    toggleMusic("toggleRight")
    loop()
    showList()
    listAction()
}

main()