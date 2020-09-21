/*!
 * @license
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy
 * of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 *
 * @author  SJ Chou, <sj@toright.com>
 * @version 1.0.1
 * @date    2020-09-21
 * @site    https://github.com/samejack/jform
 */

(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["jfrom"] = factory();
	else
		root["jfrom"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	jQuery.fn.jform = function (args) {

		// return json string
		if (typeof(args) === 'undefined') {
		  var dataSet = {};
	  
		  // make data set object
		  $.each($(this).serializeArray(), function () {
			if (this.name.match(/^.+\[\]$/)) {
			  // if name end of [] use array logic to process
			  if (typeof(dataSet[this.name]) !== 'object') {
				dataSet[this.name] = [];
			  }
			  dataSet[this.name].push(this.value);
			} else if (typeof(dataSet[this.name]) === 'undefined') {
			  dataSet[this.name] = this.value;
			} else if (jQuery.isArray(dataSet[this.name])) {
			  dataSet[this.name].push(this.value);
			} else if (typeof(dataSet[this.name]) === 'string'
			  || typeof(dataSet[this.name]) === 'number'
			) {
			  dataSet[this.name] = [dataSet[this.name], this.value];
			}
		  });
	  
		  // native json encode
		  if (typeof(JSON) === 'object' && typeof(JSON.stringify) === 'function') {
			return JSON.stringify(dataSet);
		  } else {
			return $.toJSON(dataSet);
		  }
		}
	  
		// set json string to form element
		var parent = this, setValue, obj = null;
		if (typeof(args) === 'string') {
		  obj = jQuery.parseJSON(args);
		} else if (typeof(args) === 'object') {
		  obj = args;
		}
		if (obj === null) {
		  console.error('input obj not found.');
		  return;
		}
	  
		setValue = function (name, value) {
		  if (typeof(value) === 'undefined' || value === null) {
			return;
		  }
		  var queryElements = $(parent).find(
			'input[name="' + name + '"], select[name="' + name + '"], textarea[name="' + name + '"], ' +
			'input[name="' + name + '[]"], select[name="' + name + '[]"], textarea[name="' + name + '[]"]'
		  );
	  
		  $.each(queryElements, function (index, element) {
			var obj = $(element);
			var type = null;
			if (typeof(obj.context) === 'undefined') {
				// jquery over 3.0
				type = obj.attr('type');
				if (typeof(type) === 'undefined') {
					var tagName = obj.prop('tagName');
					if (tagName === 'TEXTAREA') {
						type = 'textarea';
					} else if (tagName === 'SELECT') {
						if (typeof(obj.attr('multiple')) !== 'undefined'
							&& (obj.attr('multiple').toLowerCase() === 'multiple' || obj.attr('multiple').toLowerCase() === 'true')
						) {
							type = 'select-multiple';
						} else {
							type = 'select';
						}
					}
				}
			} else {
				// jquery 1.2
				type = obj.context.type;
			}

			switch (type) {
			  case 'text':
			  case 'hidden':
			  case 'email':
			  case 'date':
			  case 'datetime-local':
			  case 'color':
			  case 'month':
			  case 'number':
			  case 'password':
			  case 'search':
			  case 'range':
			  case 'tel':
			  case 'url':
			  case 'time':
			  case 'week':
			  case 'select-one':
			  case 'select':
				obj.val(value);
				obj.triggerHandler('change');
				break;
			  case 'checkbox':
				obj.each(function () {
				  if (typeof(value) === 'string' || typeof(value) === 'number') {
					// single
					if ($(this).val().toString() === value.toString()) {
					  $(this).prop('checked', true);
					} else {
					  $(this).prop('checked', false);
					}
				  } else if (typeof(value) === 'object') {
					// multiple
					$(this).prop('checked', false);
					for (var i in value) {
					  if ($(this).val().toString() === value[i].toString()) {
						$(this).prop('checked', true);
					  }
					}
				  }
				});
				break;
			  case 'select-multiple':
				$(this).find('option').each(function () {
				  $(this).prop('selected', false);
				  if (typeof(value) === 'object') {
					// multiple
					for (var i in value) {
					  if ($(this).val().toString() === value[i].toString() || $(this).text() === value[i].toString()) {
						$(this).prop('selected', true);
					  }
					}
				  } else if ($(this).val().toString() === value.toString()) {
					$(this).prop('selected', true);
				  }
				});
				break;
			  case 'radio':
				obj.each(function () {
				  if ($(this).val().toString() === value.toString()) {
					$(this).prop('checked', true);
				  }
				});
				break;
			  case 'textarea':
				obj.val(value);
				break;
			  default:
				console.error('unknown type: ' + type);
				break;
			}
		  });
		};
	  
		$.each(obj, function (key, value) {
		  if (value == null) {
			return;
		  }
		  setValue(key, value);
		});
	  
	  };
	  

/***/ }
/******/ ])
});
;