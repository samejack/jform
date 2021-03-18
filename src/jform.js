jQuery.fn.jform = function (args) {

  // return json string
  if (typeof (args) === 'undefined') {
    var dataSet = {};

    // make data set object
    $.each($(this).serializeArray(), function () {
      if (this.name.match(/^.+\[\]$/)) {
        // if name end of [] use array logic to process
        if (typeof (dataSet[this.name]) !== 'object') {
          dataSet[this.name] = [];
        }
        dataSet[this.name].push(this.value);
      } else if (typeof (dataSet[this.name]) === 'undefined') {
        dataSet[this.name] = this.value;
      } else if (jQuery.isArray(dataSet[this.name])) {
        dataSet[this.name].push(this.value);
      } else if (typeof (dataSet[this.name]) === 'string'
        || typeof (dataSet[this.name]) === 'number'
      ) {
        dataSet[this.name] = [dataSet[this.name], this.value];
      }
    });

    // hidden
    $(this).find('input[type="hidden"]').each(function () {
      // don't replace current value
      if (typeof (dataSet[this.name]) !== 'undefined') return;

      if (this.name.match(/^.+\[\]$/)) {
        // if name end of [] use array logic to process
        if (typeof (dataSet[this.name]) !== 'object') {
          dataSet[this.name] = [];
        }
        dataSet[this.name].push(this.value);
      } else if (typeof (dataSet[this.name]) === 'undefined') {
        dataSet[this.name] = this.value;
      } else if (jQuery.isArray(dataSet[this.name])) {
        dataSet[this.name].push(this.value);
      } else if (typeof (dataSet[this.name]) === 'string'
        || typeof (dataSet[this.name]) === 'number'
      ) {
        dataSet[this.name] = [dataSet[this.name], this.value];
      }
    });

    // native json encode
    if (typeof (JSON) === 'object' && typeof (JSON.stringify) === 'function') {
      return JSON.stringify(dataSet);
    } else {
      return $.toJSON(dataSet);
    }
  }

  // set json string to form element
  var parent = this, setValue, obj = null;
  if (typeof (args) === 'string') {
    obj = jQuery.parseJSON(args);
  } else if (typeof (args) === 'object') {
    obj = args;
  }
  if (obj === null) {
    console.error('input obj not found.');
    return;
  }

  setValue = function (name, value) {
    if (typeof (value) === 'undefined' || value === null) {
      return;
    }
    var queryElements = $(parent).find(
      'input[name="' + name + '"], select[name="' + name + '"], textarea[name="' + name + '"], ' +
      'input[name="' + name + '[]"], select[name="' + name + '[]"], textarea[name="' + name + '[]"]'
    );

    $.each(queryElements, function (index, element) {
      var obj = $(element);
      var type = null;
      if (typeof (obj.context) === 'undefined') {
        // jquery over 3.0
        type = obj.attr('type');
        if (typeof (type) === 'undefined') {
          var tagName = obj.prop('tagName');
          if (tagName === 'TEXTAREA') {
            type = 'textarea';
          } else if (tagName === 'SELECT') {
            if (typeof (obj.attr('multiple')) !== 'undefined'
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
            if (typeof (value) === 'string' || typeof (value) === 'number') {
              // single
              if ($(this).val().toString() === value.toString()) {
                $(this).prop('checked', true);
              } else {
                $(this).prop('checked', false);
              }
            } else if (typeof (value) === 'object') {
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
            if (typeof (value) === 'object') {
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

