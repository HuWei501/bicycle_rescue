Page({
	data: {

	},
	onLoad: function (options) {

	},
	goAddRecord (e) {
		const type = e.currentTarget.dataset.type;
		wx.navigateTo({
            url: 'record/record?type=' + type
		});
	}
})