define(['jquery', 'ko', 'text!componentApp/home/home.html', 'components/checkbox', 'components/radio', 'components/combox'], function($, ko, template, checkbox, radio, combox) {

	function VM() {
		this.sex = radio.VM([{text:'男',value: 1}, {text:'女', value: 2}])
		this.days = checkbox.VM([{text:'1天',value: 1}, {text:'2天', value: 2}, {text:'3天', value: 3}])
		this.citys = combox.VM([{text:'北京',value: 'BJ'}, {text:'上海', value: 'SH'}, {text:'广州', value: 'GZ'}, {text:'深圳', value: 'SZ'}])
	}

	return {
		viewModel: {
			createViewModel: function() {
				var vm = new VM;
				return vm;
			}
		},
		template: template
	}

})