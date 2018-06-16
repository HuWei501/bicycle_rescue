Page({
  data: {
  
  },
  onLoad: function (options) {

  },
  //点击确认授权获取用户信息
  bindGetUserInfo: function(e) {
    wx.authorize({
      scope: 'scope.userInfo',
      success: (res) => {
        wx.getUserInfo({
          success: (res) => {
            console.log("授权成功"),
              console.log(res.userInfo),
              wx.reLaunch({
                url: '/pages/index/index',
              })
          }
        })
      },
      //用户若拒绝授权，弹出二次确认框
      fail: (res) => {
        console.log("授权失败"),
          wx.showModal({
            title: '您拒绝了授权',
            content: '拒绝授权小程序部分功能会受限喔',
            success: (res) => {
              if (res.confirm) {
                wx.reLaunch({
                  url: '/pages/index/index',
                })
              }
            }
          })
      }
    })
    console.log(e.detail.userInfo)
    },

    //点击取消授权弹出二次确认框
    refuseInfo: function (e) {
      wx.showModal({
        title: '您拒绝了授权',
        content: '拒绝授权小程序部分功能会受限喔',
        success: (res) => {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/index/index',
            })
          }
        }
      })
    },
})