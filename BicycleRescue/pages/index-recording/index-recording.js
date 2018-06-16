// pages/index-recording/index-recording.js
var QQMap = require("/libs/qqmap-wx-jssdk.js");  //将经纬度转化为具体地址的SDK
var qqMapSdk;
Page({
  data: {
    showMask: true,
    showTextarea: true,
    showPickContent: "私自上锁",
    showAddr: "",
    showAddrInput: false,
    InputAddrContent: "",
    uploadAddrText: "确定",
    uploadText: "确定上传",
    focus: false,
    focusAddr: false,
    recordingText: "",
    recordingPicPath: [],
    picNum: 3,
    crossLeft: '',
    crossShow: true,
    startTime: '',
    endTime: '',
    maskList: [{
      message: "私自上锁",
    }, 
    {
      message: "乱停乱放",
      }, 
      {
        message: "被扔河道",
      },
      {
        message: "远离市区",
      },
      {
        message: "其它问题",
      }],
    picList: [],
  },

  //实例化SDK，设置选择问题页面隐藏，设置十字图案及背景初始位置
  onLoad: function (options) {
    showMask: (options.showMask == "true"?true:false),
    qqMapSdk = new QQMap({
      key: 'SP5BZ-2RCEF-SXWJW-NNRYZ-HGDT3-IOFFO'
    }),
    this.setData({
      crossLeft: wx.getSystemInfoSync().windowWidth / 750 * 25
    })

  },

  //点击问题选择框显示问题选择类型的页面
  onChangeShowState: function() {
    var mask = this;
    mask.setData({
      showMask: (!mask.data.showMask),
      showTextarea: false
    })
  },
  chooseType: function(e){
    console.log(e);
    var currentChoose = e.currentTarget.dataset.message;
    this.setData({
      showPickContent: currentChoose,
      showMask: true,
      showTextarea: true
    })

  },

  //用户从相机或相册中添加图片
  uploadPic: function(){
    var that = this;
    var picNumber = that.data.picNum;
    if(picNumber > 0){
      wx.chooseImage({
        count: picNumber,
        sizeType: 'compressed',
        sourceType: ['album', 'camera'],
        success: function (res) {
          var arr = that.data.picList;
          if(arr.length <= 2){
            for (var i = 0; i < res.tempFiles.length; i++) {
              arr.push(res.tempFilePaths[i]);
              that.setData({
                crossLeft: that.data.crossLeft + wx.getSystemInfoSync().windowWidth / 750 * 245
              });
              console.log(arr);
              if(arr.length == 3) {
                break;
              }
            } 
          }       
          if ((picNumber - res.tempFiles.length) == 0) {
            that.setData({
              crossShow: false
            })
          } 
          console.log("调用相机或相册成功"),
          console.log(res),
          console.log(res.tempFiles.length)
          that.setData({
            picNum: picNumber - res.tempFiles.length,
            picList: arr
          });
          console.log(that.data.picNum)
          console.log(that.data.picList)
        }
      })
    }
    else {
      wx.showToast({
        title: '最多只能上传3张照片',
        icon: 'none',
        duration: 2500,
        mask: true,
        success: function(res) {},
      })
    };
  },

  //按下开始时间
  bindtouchstart: function(e){
    this.setData({
      startTime: e.timeStamp
    })
  },

  //按下结束时间
  bindtouchend: function(e){
    this.setData({
      endTime: e.timeStamp
    })
  },

  //删除照片
  deletePic: function(e){
    var that = this;
    console.log(parseInt(that.data.endTime));
    console.log(parseInt(that.data.startTime));
    console.log(parseInt(that.data.startTime - that.data.endTime));
   
      var picIndex = parseInt(e.currentTarget.dataset.index);
      console.log(e);
      console.log(picIndex);
      var imgArr = that.data.picList;
      wx.showActionSheet({
        itemList: ['删除照片', '取消'],
        success: (res) => {
          if (!res.cancel) {
            if (res.tapIndex == 0) {
              imgArr.splice(picIndex, 1);
              that.setData({
                picList: imgArr,
                crossShow: true,
                crossLeft: that.data.crossLeft - wx.getSystemInfoSync().windowWidth / 750 * 245,
                picNum: that.data.picNum + 1
              });
              console.log(that.data.picNum)
            }
          }
        }
      })
    
  },

  //预览照片
  previewPic: function(e){
    var that = this;
    if (parseInt(that.data.endTime - that.data.startTime) < 350) { 
      var picIndex = parseInt(e.currentTarget.dataset.index);
      console.log(e);
      console.log(picIndex);
      var imgArr = that.data.picList;
      wx.previewImage({
        current: imgArr[picIndex],
        urls: imgArr,
        success: (res) => {

        }
      })
    }
  },

  //用户手动输入地址
  bindInputAddr: function(){
    this.setData({
      focusAddr: true
    })
  },
  bindAddrContent: function(e){
    var addrContent = e.detail.value;
    this.setData({
      showAddr: addrContent,
      InputAddrContent: addrContent
    })
  },
  uploadAddr: function(){
    if (this.data.InputAddrContent != ""){
      this.setData({
        showAddrInput: false,
        showTextarea: true
      })
    }
    else {
      wx.showToast({
        title: '请输入当前地址',
        duration: 2000,
        icon: "none",
        mask: true
      })
    }
  },

  //获取用户输入内容，采取函数截留，输入停止500ms后再请求数据
  bindInputTap: function () {
    this.setData({
      focus: true
    })
  },
  recordingContent: function(e){
    if(this.timer){
      clearTimeout(this.timer)
    }
    this.timer = setTimeout(()=>{
      var content = e.detail.value;
      this.setData({
        recordingText: content
      })
    },500)
  },

  //点击确定获取当前页面所有数据
  uploadMessage: function(){
    console.log(this.data.showPickContent),
    console.log(this.data.recordingText),
    console.log(this.data.showAddr),
    console.log(this.data.picList),
    wx.showToast({
      title: '上传成功',
      icon: 'success',
      duration: 2500,
      mask: true,
      success: (res)=>{
        setTimeout(function(){
          wx.reLaunch({
            url: '/pages/index-recorded/index-recorded',
          })
        },2500)

      },
    })
  },
  getAddr: function() {
    this.setData({
      showAddrInput: true,
      showTextarea: false
    })
  },

  //因开发版测试用不了转换经纬度的外部JS，默认需要用户手动输入地址
  onReady: function () {
    this.setData({
      showAddr: "获取位置失败，请点击手动输入当前位置"
    })

    //获取用户当前位置并转换为文字显示，因需要设置安全域名在开发版测试暂时用不了
    // wx.getLocation({
    //   success: (res)=> {
    //     qqMapSdk.reverseGeocoder({
    //       location: {
    //         latitude: res.latitude,
    //         longitude: res.longitude
    //       },
    //       success: (addrRes)=> {
    //         var address = addrRes.result.formatted_addresses.recommend;
    //         this.setData({
    //           showAddr: address
    //         })
    //       },
    //       fail: (addrRes)=> {
    //         this.setData({
    //           showAddr: "获取位置失败，请点击手动输入当前位置"
    //         })
    //       }
    //     })
    //   },
    // })
  }
})