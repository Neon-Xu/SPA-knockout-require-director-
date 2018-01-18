
define(['ko', 'jquery'],function(ko, $) {

	var zIndex = 1000;
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
	var all = [];
	var active;
	ko.components.register('combox', {

	    viewModel: function(params) {

	    	if(!ko.isObservable(params.items)) params.items = ko.observable(params.items);
	    	var _self = this;

	    	var items = this.items = params.items;

	    	var cname = params.name;
	    	var placeholder = params.placeholder || "请选择";
			var width = params.width || "100%";
	    	var el = params.el;
	    	this.mult = !!params.mult;
	    	var disabled = this.disabled = !!params.disabled;

	    	this.isOpen = ko.observable(false);
	    	this.position = params.position || 'down';


	    	if(params.name && params.required)
	    		innerData[cname] = this;

			this.width = width;
	    	this.toggle = function(vm, evt) {
	    		if(disabled) return;

	    		//active && active.isOpen(false);
	    		if(evt.stopPropagation)
	    			evt.stopPropagation();
	    		else
	    			evt.cancelBubble = true;

	    		this.isOpen(!this.isOpen());
	    		if(el && this.isOpen()) {
	    			el.childNodes[0].style.zIndex = zIndex++;
	    			//active = this;
	    		}
	    	}
	    	this.selectedStr = ko.pureComputed(function() {
	    		var selected = [];
	    		ko.utils.arrayForEach(items(), function(el, index) {
	    			if(el.selected())
	    				selected.push(el.text);
	    		})
	    		if(!selected.length)
	    			selected = [placeholder];

	    		return selected.join();
	    	})
	    	this.selectItem = function(data,evt){

	    		if(disabled) return;

	    		if(evt.stopPropagation)
	    			evt.stopPropagation();
	    		else
	    			evt.cancelBubble = true;


	    		if(!_self.mult) {
	    			ko.utils.arrayForEach(items(), function(el, index) {

		    			el.selected(false);
		    		})
	    			data.selected(true);
	    			_self.isOpen(false);
	    		} else {
	    			data.selected(!data.selected());
	    		}

	    		if(params.onClick && (typeof params.onClick == 'function'))
	    			params.onClick(data,evt);

	    	}

	    	this.tips = ko.observable();

	    	all.push(this);
	    },
	    template:  '<div class="cmp-combobox" data-bind="css: {\'cmp-combobox-disabled\': disabled}, style: {width: width}">\
						<div class="cmp-combobox-inner" data-bind="click: toggle, css: {\'cmp-combobox-open\': isOpen}">\
							<div class="cmp-combobox-text" data-bind="text: selectedStr"></div><i class="cmp-combobox-toggle"></i>\
						</div>\
						<div class="cmp-combobox-items" data-bind="visible: isOpen, css: {\'cmp-combobox-up\': position == \'up\'}">\
							<ul data-bind="foreach: items">\
								<li data-bind="text:text, attr: {\'data-value\': value}, click: $parent.selectItem, css:{\'cmp-combobox-selected\': selected}"></li>\
							</ul>\
						</div>\
					</div>\
					<span data-bind="text: tips, visible: !!tips()" class="cmp-input-tips" ></span>'
	})

	$('body').on('click', function() {
		for(var i=0,len=all.length;i<len;i++) {
			if(all[i])
				all[i].isOpen(false);
		}
	})

	return {
		VM: function (oriArr) {
			var vmArr = [];
			if(!oriArr) return vmArr;
			for(var i=0,len=oriArr.length;i<len;i++) {
				vmArr.push({
					text: oriArr[i].text,
					value: oriArr[i].value,
					selected: ko.observable(!!oriArr[i].selected),
					sub: oriArr[i].sub || []
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
		},
		close: function() {
			for(var inputName in innerData) {
				var vm = innerData[inputName];
				vm.isOpen(false);
			}
		}
	}


});
