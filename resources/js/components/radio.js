	

// 
// 
// 
// 
define(['ko'],function(ko) {

	function getStrValue(obsArr) {
		if(ko.isObservable(obsArr))
			obsArr = obsArr();
		var checked = '';
		for(var i=0,len=obsArr.length;i<len;i++) {
			if(obsArr[i].selected()) {
				checked = obsArr[i]['value'];
			}
		}
		return checked;
	}
	var innerData = {};

	ko.components.register('radio', {
	    viewModel: function(params) {
	    	if(!ko.isObservable(params.items)) params.items = ko.observable(params.items);
	    	var _items = this.items = params.items;
	    	
	    	var cname = params.name;

	    	if(params.name && params.required)
	    		innerData[cname] = this;

	    	this.select = function(data,event) {
	    		for(var i=0,len=_items().length;i<len;i++) {
		    		_items()[i].selected(false);
		    	}
	    		data.selected(true);
	    		if(params.onClick && (typeof params.onClick == 'function'))
	    			params.onClick(data, event);
	    	}
	    	this.tips = ko.observable();

	    },
	    template:   '<div data-bind="foreach: items">\
		    			<a href="javascript:;" class="cmp-radio" data-bind="click: $parent.select, css:{\'selected\': selected}, attr: {\'data-value\' : value, \'data-name\': name}">\
			    			<i class="cmp-icon-radio"></i>\
			    			<span class="cmp-radio-text" data-bind="text: text"></span>\
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
		getFullValue: function(obsArr) {
			var fullValue = [];
			for(var i=0,len=obsArr.length;i<len;i++) {
				if(obsArr[i].selected()) {
					fullValue.push(obsArr[i]);
					break;
				}
			}
			return fullValue;
		},

		getStrValue: getStrValue,

		validate: function(target) {

			var valid = true;
			for(var inputName in innerData) {

				var vm = innerData[inputName];

				if(target && target.length) {
					for(var i=0,len=target.length;i<len;i++) {
						if(inputName == target[i]) {
							var v = getStrValue(vm.items);
							if(!v) {
								valid = false;
								vm.tips('请选择');
							} else {
								vm.tips('');
							}
					    	break;
						}
					}
				} else {

					var v = getStrValue(vm.items);
					if(!v) {
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
	

	