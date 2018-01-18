

define(['ko'],function(ko) {

	var messages = {
            required: '必填项',
            max: '最多输入{count}个字符',
            min: '最少输入{count}个字符'
        },
        trim = function(data) {
        	var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
        	return data.replace(rtrim, '');
        },
        methods = {
        	required: function(data) {
                var placeholder = data.el.getAttribute("placeholder"),
                    val = trim(data.val);
                if( !val || val == placeholder )
                    return messages['required'];
            },
            max : function(data) {
            	var len = data.val.length;
            	if(len > data.max)
            		return messages['max'].replace('{count}', data.max);
            },
            min : function(data) {
            	var len = data.val.length;
            	if(len < data.min)
            		return messages['min'].replace('{count}', data.min);
            }
        };

    function check(params,el) {

   		var tips = [], tip;

		if(params.valid && params.valid.length) {
    		var valids = params.valid;
    		
    		for(var i=0,len=valids.length;i<len;i++) {
    			if(methods[valids[i]] && typeof methods[valids[i]] == 'function') {
    				tip = methods[valids[i]]({
    					el: el,
    					val: el.value
    				});
    				tip && tips.push(tip);
    			}
    		}
    		
    	}
    	if(params.max) {
    		tip = methods['max']({
				el: el,
				val: el.value,
				max: params.max
			})
    		tip && tips.push(tip);
    	}
    	if(params.min) {
    		tip = methods['min']({
				el: el,
				val: el.value,
				min: params.min
			})
    		tip && tips.push(tip);
    	}
    	return tips;
   }

    var innerData = {};

	ko.components.register('c-textarea', {

	    viewModel:  {
	    	createViewModel: function(params, componentInfo) {


		    	function VM() {
		    		var _self = this;
		    		this.tips = ko.observable();
			    	this.val = params.value || '';
			    	this.cname = params.name || '';
			    	this.width = (params.width || 500)+'px';
			    	this.height = (params.height || 100)+'px';
			    	this.placeholder = params.placeholder || '';

			    	this.check = function(vm, evt) {

			    		var el = evt.target;
			    		
			    		var tips = check(params, el);

				    	if(tips.length)
				    		this.tips(tips.join(' | '));
				    	else
				    		this.tips('');
			    	}
		    	}

		    	var vm = new VM;
		    	
		    	innerData[params.name] = {
		    		params: params,
		    		el: componentInfo.element.childNodes[0].childNodes[0].childNodes[0],
		    		tips: vm.tips
		    	};

		    	return vm;
	    	}

	    },
	    template: '<div class="cmp-textarea"><div><textarea data-bind="value: val, event: { blur: check}, attr: {name: cname, placeholder:placeholder}, style : { width: width, height: height }, css: {\'cmp-input-error\': !!tips()}" class="cmp-input" /></div><div data-bind="text: tips, visible: !!tips()" class="cmp-input-tips cmp-tips-block" ></div></div>'
	});


	return {
		validate: function(target) {
			var valid = true;
			for(var inputName in innerData) {
				var data = innerData[inputName];

				if(target && target.length) {
					for(var i=0,len=target.length;i<len;i++) {
						if(inputName == target[i]) {
							var tips = check(data.params, data.el);
							if(tips.length) {
								valid = false;
					    		data.tips(tips.join(' | '));
							}
					    	else {
					    		data.tips('');
					    	}
					    	break;
						}
					}
				} else {
					var tips = check(data.params, data.el);
					if(tips.length) {
						valid = false;
			    		data.tips(tips.join(' | '));
					}
			    	else {
			    		data.tips('');
			    	}
				}

				
			}

			return valid;
		}
	}	

})