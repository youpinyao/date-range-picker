// import $ from 'jquery';
// import moment from 'moment';
// import Picker from '../src';

import './index.css';

var Picker = window.YDateRangePicker;
var pickerBox = $('.y-custom-date-range-picker');
var picker = null;

// 要标记的时间
var tagDate = [{
    date: [moment().add(2, 'day'), moment().add(3, 'day')],
    piece: true,
    name: '已锁定',
    styles: {
      backgroundColor: '#666666',
    },
  },
  {
    date: [moment().add(5, 'day'), moment().add(6, 'day')],
    piece: true,
    name: '预订',
    styles: {
      backgroundColor: '#999999',
    },
  },
  {
    date: [moment().add(9, 'day'), moment().add(11, 'day')],
    name: '空闲',
    styles: {
      backgroundColor: '#ffffff',
    },
  },
];

// 已选时间
var selectedDate = [];

var updateView = () => {
  var datesBox = $('.dates');
  var tagsBox = $('.tags');
  var dates = picker.getValue();

  if (datesBox.attr('data-render') !== 'true') {
    datesBox.attr('data-render', true);
    datesBox.bind('click', function(e) {
      var value = picker.getValue();
      if ($(e.target).hasClass('del')) {
        value.splice($(e.target).parent().index(), 1);
        picker.update({
          value: value,
        });
        updateView();
      }
    });
  }

  if (dates.length) {
    datesBox.show();
  } else {
    datesBox.hide();
  }

  tagsBox.html(tagDate.map(tag =>
    `<div><i style="background-color:${tag.styles.backgroundColor}"></i>${tag.name}</div>`));
  datesBox.html(dates.map(date =>
    `<div>${date[0].format('YYYY-MM-DD')} ~ ${date[1].format('YYYY-MM-DD')} <i class="del">×</i></div>`
  ));
};

var showPicker = function(el) {
  pickerBox.show();
  $(el).css({
    position: 'relative',
  });
  pickerBox.css({
    position: 'absolute',
    left: 0,
    top: '100%',
  });

  pickerBox.appendTo(el);
}

var hidePicker = function() {
  pickerBox.hide();
}

// eslint-disable-next-line
picker = new Picker({
  target: pickerBox.find(' > div').eq(0),
  // minDate: moment(),
  // maxDate: moment().add(10, 'day'),
  tagDate: tagDate,
  value: selectedDate,
  multiple: true,
  onChange: function(type, dates) {
    if (type === 'range') {
      console.log('onChange range', dates);
      updateView();
    }
    if (type === 'date') {
      console.log('onChange date', dates);
    }
  },
});

$(window).bind('click', function() {
  hidePicker();
});

pickerBox.bind('click', function(e) {
  e.stopPropagation();
})

// 取消按钮
pickerBox.find('.button.cancel').bind('click', function() {
  hidePicker();
});

// 保存
pickerBox.find('.button.save').bind('click', function() {
  hidePicker();
});

// 显示按钮绑定
$('.choose-button').bind('click', function(e) {
  e.stopPropagation();
  if ($(e.target).hasClass('choose-button')) {
    picker.update({
      value: [],
    });
    updateView();
    showPicker(this);
  }
});

updateView();
