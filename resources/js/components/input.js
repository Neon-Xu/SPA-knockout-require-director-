

define(['ko'],function(ko) {

	function guid() {
		return 'xxxxxx'.replace(/x/g, function(c) {
			var v = c = Math.random() * 16 | 0;
			return v.toString(16);
		});
	}


	var messages = {
            required: '必填项',
            email: '邮箱格式错误',
            number: '请填入数字',
            max: '最多输入{count}个字符',
            min: '最少输入{count}个字符',
            price: '数字类型，最多二位小数',
			idcard: '请输入正确的身份证号',
			cellphone: '请输入正确的手机号'
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
            email : function(data) {
                if(!data.val) return;
                var remail = new RegExp(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/);
                if(!remail.test(data.val))
                    return messages['email'];
            },
            number : function(data) {
                if(!data.val) return;
                var rnumber = new RegExp(/^[\-\+]?(\d+|\d+\.?\d+)$/);
                if(!rnumber.test(data.val))
                    return messages['number'];
            },
            max : function(data) {
                if(!data.val) return;
            	var len = data.val.length,
            		max = data.params.max;
            	if(len > max)
            		return messages['max'].replace('{count}', max);
            },
            min : function(data) {
                if(!data.val) return;
            	var len = data.val.length,
            		min = data.params.min;
            	if(len < min)
            		return messages['min'].replace('{count}', min);
            },
            price: function(data) {
                if(!data.val) return;
            	var reprice = /^\d+(\.\d{1,2})?$/g;
            	if(!reprice.test(data.val))
            		return messages['price'];
            },
            reg : function(data) {
                if(!data.val) return;
            	var params = data.params;
            	if(params.reg && typeof(params.reg) == 'function') {
            		var pass = params.reg(data.val);
            		if(!pass)
            			return params.tip || '校验失败';
            	}
            },
			idcard : function(data) {
				if(!data.val) return;
				var reg = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|[Xx])$/;
				if(!reg.test(data.val))
				return messages['idcard'];
			},
			cellphone: function(data) {
				if(!data.val) return;
				var reg = /^1(3[0-9]|4[57]|5[0-35-9]|7[0135678]|8[0-9])\d{8}$/;
				if(!reg.test(data.val))
				return messages['cellphone'];
			},
            numarea: function(data) {
                if(!data.val) return;
                var params = data.params.numarea;
                    rnumber = new RegExp(/^[\-\+]?(\d+|\d+\.?\d+)$/),
                    integerPlus = /^[0-9]*[1-9][0-9]*$/,
                    integerReplace = /^-?[1-9]\d*$/;
                // area: [1, 99] -> [1, 99], area: '1, 99' -> (1, 99], area: [1, '+'] -> [1, +∞], area: '1, +' -> (1, +∞]
                // isInteger 正整数
                if(params.isInteger == 1) {
                    if(!integerPlus.test(data.val)) {
                        return '输入正整数';
                    }
                } else if(params.isInteger == 2) {
                    if(!integerReplace.test(data.val)) {
                        return '输入整数';
                    }
                }

                if(!rnumber.test(data.val)) {
                    return '输入数字';
                } else {
                    // data.val = Number(data.val);
                }

                if(params.area && params.area instanceof Array) {
                    if(data.val < params.area[0] && params.area[1] == '+') {
                        return '输入大于等于' + params.area[0];
                    }

                    if(data.val < params.area[0] || data.val > params.area[1]) {
                        return '输入' + params.area[0] + '-' + params.area[1];
                    }
                } else if(params.area && typeof params.area == 'string') {
                    var arr = params.area.split(',');
                    if(data.val <= Number(arr[0]) && arr[1].trim() == '+') {
                        return '输入大于' + Number(arr[0]);
                    }

                    if(data.val <= Number(arr[0]) || data.val > Number(arr[1])) {
                        return '输入' + Number(arr[0]) + '-' + Number(arr[1]) + '（不含' + params.area[0] + '）';
                    }
                }
			}
        };

    function check(params,el) {

   		var tips = [], tip;

		if(params.valid && params.valid.length) {
    		var valids = params.valid;

    		for(var i=0,len=valids.length;i<len;i++) {
    			if(methods[valids[i]] && typeof methods[valids[i]] == 'function') {
    				tip = methods[valids[i]]({
    					params: params,
    					el: el,
    					val: el.value
    				});
    				tip && tips.push(tip);
    			}
    		}

    	}
    	if(params.max) {
    		tip = methods['max']({
    			params: params,
				el: el,
				val: el.value
			})
    		tip && tips.push(tip);
    	}
    	if(params.min) {
    		tip = methods['min']({
    			params: params,
				el: el,
				val: el.value
			})
    		tip && tips.push(tip);
    	}
    	if(params.reg) {
    		tip = methods['reg']({
    			params: params,
				el: el,
				val: el.value
			})
    		tip && tips.push(tip);
    	}
        if(params.numarea) {
            tip = methods['numarea']({
                params: params,
                el: el,
                val: el.value
            })
            tip && tips.push(tip);
        }
    	return tips;
   }

    var innerData = {};

	ko.components.register('c-input', {

	    viewModel:  {
            createViewModel: function(params, componentInfo) {

                function VM() {
            		var _self = this;
            		this.tips = ko.observable();
        	    	this.val = params.value || '';
        	    	this.cname = params.name || 'input-' + guid();
        	    	this.width = (params.width || 200)+'px';
        	    	this.placeholder = params.placeholder || '';
					this.maxLength = params.maxLength || '';

        	    	this.hide = !!(params.hideTips || false);

        	    	this.check = function(vm, evt) {

        	    		var el = evt.target;

        	    		var tips = check(params, el);

        				if(tips.length) {
        		    		_self.tips(tips.join(' | '));
        				}
        		    	else{
        		    		_self.tips('');
        		    	}
        	    	}
                }

                var vm = new VM;

                innerData[params.name] = {
                    params: params,
                    el: componentInfo.element.childNodes[0].childNodes[0],
                    tips: vm.tips
                };

                return vm;



            }

	    },
	    template: '<div class="cmp-input-text"><input type="text" data-bind="value: val, event: { blur: check}, attr: {name: cname, placeholder:placeholder, maxLength: maxLength}, style : { width: width }, css: {\'cmp-input-error\': !!tips()}" class="cmp-input" /><span data-bind="text: tips, visible: !!tips() && !hide" class="cmp-input-tips" ></span></div>'
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
