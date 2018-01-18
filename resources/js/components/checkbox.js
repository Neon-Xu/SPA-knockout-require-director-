
// 
// 
define(['ko'],function(ko) {

	function getFullValue(obsArr) {
		if(ko.isObservable(obsArr))
			obsArr = obsArr();
		var fullValue = [];
		for(var i=0,len=obsArr.length;i<len;i++) {
			if(obsArr[i].selected()) {
				fullValue.push(obsArr[i]);
			}
		}
		return fullValue;
	}

	var innerData = {};

	ko.components.register('checkbox', {
	    viewModel: function(params) {

	    	
	    	var items = this.items = params.items;
	    	var cname = params.name;

	    	if(params.name && params.required)
	    		innerData[cname] = this;

	    	this.toggle = function(e) {
	    		this.selected(!this.selected());
	    		if(params.onClick && (typeof params.onClick == 'function'))
	    			params.onClick(e);
	    	}
	    	this.tips = ko.observable();

	    },
	    template:   '<div data-bind="foreach: items">\
	    				<a href="javascript:;" class="cmp-checkbox" data-bind="click: $parent.toggle, css: {selected: selected}, attr: {\"data-value\" : value, \"data-name\": name}">\
	    					<i class="cmp-icon-checkbox"></i>\
	    					<span class="cmp-checkbox-text" data-bind="text: text"></span>\
	    				</a>\
	    			</div>\
	    			<span data-bind="text: tips, visible: !!tips()" class="cmp-input-tips" ></span>'

	});


	return {
		VM: function (oriArr) {
			var vmArr = [];
			for(var i=0,len=oriArr.length;i<len;i++) {
				vmArr.push({
					text: oriArr[i].text,
					value: oriArr[i].value,
					selected: ko.observable(!!oriArr[i].selected)
				})
			}
			return vmArr;
		},

		getFullValue: getFullValue,

		getStrValue: function(obsArr) {
			var checked = [];
			for(var i=0,len=obsArr.length;i<len;i++) {
				if(obsArr[i].selected()) {
					checked.push(obsArr[i]['value']);
				}
			}
			return checked.join();
		},

		validate: function(target) {

			var valid = true;
			for(var inputName in innerData) {

				var vm = innerData[inputName];

				if(target && target.length) {
					for(var i=0,len=target.length;i<len;i++) {
						if(inputName == target[i]) {
							var v = getFullValue(vm.items);
							if(!v.length) {
								valid = false;
								vm.tips('请选择');
							} else {
								vm.tips('');
							}
					    	break;
						}
					}
				} else {

					var v = getFullValue(vm.items);
					if(!v.length) {
						valid = false;
						vm.tips('请选择');
					} else {
						vm.tips('');
					}

				}
			}

			return valid;
		}
	}
})
	

	