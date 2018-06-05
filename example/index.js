import $ from 'jquery';
import moment from 'moment';
import Picker from '../src';
import './index.css';

const pickerBox = $('.y-custom-date-range-picker');
let picker = null;

// 要标记的时间
const tagDate = [
  {
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
const selectedDate = [];

const updateView = () => {
  const datesBox = $('.dates');
  const tagsBox = $('.tags');
  const dates = picker.getValue();

  if (datesBox.attr('data-render') !== 'true') {
    datesBox.attr('data-render', true);
    datesBox.bind('click', (e) => {
      const value = picker.getValue();
      if ($(e.target).hasClass('del')) {
        value.splice($(e.target).parent().index(), 1);
        picker.update({
          value,
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
  datesBox.html(dates.map(date => `<div>${date[0].format('YYYY-MM-DD')} ~ ${date[1].format('YYYY-MM-DD')} <i class="del">×</i></div>`));
};

// eslint-disable-next-line
const showPicker = (el) => {
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
};

// eslint-disable-next-line
const hidePicker = () => {
  pickerBox.hide();
};

// eslint-disable-next-line
picker = new Picker({
  target: pickerBox.find(' > div').eq(0),
  // minDate: moment(),
  // maxDate: moment().add(10, 'day'),
  tagDate,
  value: selectedDate,
  multiple: true,
  onChange: (type, dates) => {
    if (type === 'range') {
      console.log('onChange range', dates);
      updateView();
    }
    if (type === 'date') {
      console.log('onChange date', dates);
      picker.update({
        tagDate,
      });
    }
  },
});

$(window).bind('click', () => {
  hidePicker();
});

pickerBox.bind('click', (e) => {
  e.stopPropagation();
});

// 取消按钮
pickerBox.find('.button.cancel').bind('click', () => {
  hidePicker();
});

// 保存
pickerBox.find('.button.save').bind('click', () => {
  hidePicker();
});

// 显示按钮绑定
// eslint-disable-next-line
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
