// pages/player/player.js
const app = getApp();

let musiclist = []
let nowPlayingIndex = 0
    // properties(Read only)(duration,currentTime,paused,buffered)
    // properties(src(m4a, aac, mp3, wav),startTime,title,epname,singer,coverImgUrl,webUrl,protocol)
    //获取全局唯一的背景音频管理器
const backAudioManager = wx.getBackgroundAudioManager();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        picUrl: '',
        isPlaying: false,
        isLyricShow: false, //表示当前歌词是否展示
        lyric: '',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        console.log(options);
        nowPlayingIndex = options.index
        musiclist = wx.getStorageSync('musiclist')
        this._loadMusicDetail(options.musicid)

    },
    togglePlaying() {
        //表明正在播放
        if (this.data.isPlaying) {
            backAudioManager.pause()
        } else {
            backAudioManager.play()
        }
        this.setData({
            isPlaying: !this.data.isPlaying
        })
    },
    onPrev() {
        nowPlayingIndex--
        if (nowPlayingIndex < 0) {
            nowPlayingIndex = musiclist.length - 1
        }
        //此处的.id，表示当前歌曲项目的唯一标识id,用于在云函数中，查询返回对应id歌曲音频
        this._loadMusicDetail(musiclist[nowPlayingIndex].id)
    },
    onNext() {
        nowPlayingIndex++
        if (nowPlayingIndex === musiclist.length) {
            nowPlayingIndex = 0
        }
        //此处的.id，表示当前歌曲项目的唯一标识id,用于在云函数中，查询返回对应id歌曲音频
        this._loadMusicDetail(musiclist[nowPlayingIndex].id)

    },
    onChangeLyricShow() {
        this.setData({
            isLyricShow: !this.data.isLyricShow
        })
    },
    _loadMusicDetail(musicid) {
        backAudioManager.stop()
        let music = musiclist[nowPlayingIndex]
        console.log(music);
        wx.setNavigationBarTitle({
            title: music.name
        });
        this.setData({
            picUrl: music.al.picUrl,
            isPlaying: false,
        })
        wx.showLoading({
            title: '加载中...',
            mask: true,
        });
        wx.cloud.callFunction({
            name: 'music-m',
            data: {
                musicid,
                $url: 'musicUrl',
            }
        }).then(res => {
            // console.log(res);这个地方返回的res值为string类型，最好转化为字符串类型，方便观察
            // console.log(JSON.parse(res.result));
            //调用完成后，直接获取相应的url地址，之后设定全局背景音频播放器，直接全局播放音乐
            let result = JSON.parse(res.result)
            backAudioManager.src = result.data[0].url
            backAudioManager.title = music.name
            backAudioManager.coverImgUrl = music.al.picUrl
            backAudioManager.singer = music.ar[0].name
            backAudioManager.epname = music.al.name
            this.savePlayHistory()
            this.setData({
                isPlaying: true
            })
            wx.hideLoading();


            // 加载歌词
            // wx.cloud.callFunction({
            //     name: 'music-m',
            //     data: {
            //         musicid,
            //         $url: 'lyric',
            //     }
            // }).then((res) => {
            //     console.log(res);
            //     let lyric = '暂无歌词'
            //     const lrc = JSON.parse(res.result).lrc
            //     if (lrc) {
            //         lyric = lrc.lyric
            //     }
            //     // this.setData({
            //     //     // lyric: lrc.lyric
            //     // })
            // })

        })

    },

    //保存播放历史
    savePlayHistory() {
        const music = musiclist[nowPlayingIndex]
        const openid = app.globalData.openid
        const history = wx.getStorageSync(openid)
        let bHave = false
        for (let i = 0, len = history.length; i < len; i++) {
            if (history[i].id == music.id) {
                bHave = true
                break
            }
        }
        if (!bHave) {
            history.unshift(music)
            wx.setStorage({
                key: openid,
                data: history,
            });
        }
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})