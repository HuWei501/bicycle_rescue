//index.js

Page({
    data: {
        latitude: 0,
        longitude: 0,
        scale: 15,
        mapHeight: "",
        openCamera: "拍照记录",
        indexHelp: "帮助",
        indexRecord: "记录",
        indexPerson: "个人",
        cameraWidth: "",
        cameraHeight: ""
    },
    onLoad: function (options) {
      // 地图高度自适应
      wx.getSystemInfo({
        success: (res)=>{
          var windowHeight = res.windowHeight;
          var windowWidth = res.windowWidth;
          var convertNum = windowWidth/750;
          var conbertRatio = 750/windowWidth;
          var rpxHeight = windowHeight - 130*convertNum;
          var ovalsTop = windowHeight - 325 * convertNum;
          this.setData({
            mapHeight: rpxHeight,
            markers: [{
              id: 0,
              width: 1,
              height: 1
            }],
            controls: [{
              id: 1,
              iconPath: '/image/index-send-btn.png',
              position: {
                left: 640*convertNum,
                top: 540*convertNum,
                width: 84*convertNum,
                height: 84*convertNum
              },
              clickable: true
            },
              {
                id: 2,
                iconPath: '/image/index-download-btn.png',
                position: {
                  left: 640 * convertNum,
                  top: 660 * convertNum,
                  width: 84 * convertNum,
                  height: 84 * convertNum
                },
                clickable: true
              },
              {
                id: 4,
                iconPath: '/image/index-curve.png',
                position: {
                  left: 0,
                  top: windowHeight - 220 * convertNum,
                  width: 750 * convertNum,
                  height: 100 * convertNum
                },
                clickable: false
              },    
              {
                id: 3,
                iconPath: '/image/index-ovals-icon.png',
                position: {
                  left: 282 * convertNum,
                  top: ovalsTop,
                  width: 186 * convertNum,
                  height: 186 * convertNum
                },
                clickable: true
              }       
            ]
          })
        }
      }),

      // 将当前位置移至地图中心，并设置当前位置图标(改方法有问题,会持续刷新整个地图组件)
      // this.picTimer = setInterval(()=>{
      //   wx.getLocation({
      //     type: "gcj02",
      //     success: (res) => {
      //       this.setData({
      //         latitude: res.latitude,
      //         longitude: res.longitude,
      //         markers: [{
      //           id: 0,
      //           latitude: res.latitude,
      //           longitude: res.longitude,
      //           autoRotate: true,
      //           iconPath: '/image/index-position-icon.png',
      //           width: wx.getSystemInfoSync().windowWidth / 750 * 88,
      //           height: wx.getSystemInfoSync().windowWidth / 750 * 88
      //         }]
      //       })
      //     }

      //   })
      // },2000)

      //获取当前位置经纬度,通过markers更改当前位置图标,暂无法实现实时更新当前位置及图标旋转功能
      wx.getLocation({
        type: "gcj02",
        success: (res) => {
          this.setData({
            latitude: res.latitude,
            longitude: res.longitude,
            markers: [{
              id: 0,
              latitude: res.latitude,
              longitude: res.longitude,
              autoRotate: true,
              iconPath: '/image/index-position-icon.png',
              width: wx.getSystemInfoSync().windowWidth/750*88,
              height: wx.getSystemInfoSync().windowWidth/750*88
            }]
          })
        }

      })
    },
    // onShow: function() {
    //   this.mapCtx = wx.createMapContext("indexMap");
    //   this.movetoPosition()
    // },
    // movetoPosition: function() {
    //   this.mapCtx.moveToLocation();
    // },

    //地图各控件功能
    bindControlTap: function(e) {
      switch(e.controlId){
        case 1: 
          wx.showToast({
            title: "喜欢的话点一下右上角转发吧~",
            icon: "none",
            duration: 2500
          });
          break;
        case 2:
          wx.showToast({
            title: "哎哟，APP正在开发的路上喔",
            icon: "none",
            duration: 2500
          });
          break;
        case 3:
          wx.navigateTo({
            url: '/pages/index-recording/index-recording'
          });
          break;
        default:break;
      }
    },

    // 转发功能
    onShareAppMessage: function(res) {
      if(res.from === 'button'){
        console.log(res.target)
      }
      return {
        title: "棒棒公益单车小程序",
        desc: "这是一个由棒棒公益出品的小程序，旨在拯救损坏和被遗弃的共享单车，大家一起做公益！",
        path: '/pages/index/index',
        success: (res)=>{
          console.log("转发成功")
        },
      }
    },

    // 下载公益单车APP
    downloadApp: function() {
      wx.showToast({
        title: "哎哟，APP正在开发的路上喔",
        icon: "none",
        duration: 2500
      })
    },

    // 点击拍照记录按钮跳转至记录页面
    openCamera: function() {
      wx.navigateTo({
        url: '/pages/index-recording/index-recording',
      })
    }
})