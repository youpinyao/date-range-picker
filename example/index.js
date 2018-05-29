import $ from 'jquery';
import moment from 'moment';
import Picker from '../src';

const tagDate = [
  {
    date: [moment().add(2, 'day'), moment().add(3, 'day')],
    styles: {
      backgroundColor: '#666666',
    },
  },
  {
    date: [moment().add(5, 'day'), moment().add(6, 'day')],
    styles: {
      backgroundColor: '#999999',
    },
  },
];

const selectedDate = [];

// eslint-disable-next-line
const picker = new Picker({
  target: $('.picker'),
  // minDate: moment(),
  // maxDate: moment().add(10, 'day'),
  tagDate,
  onChange(dates) {
    console.log('onchange', dates);
    selectedDate.push({
      date: dates,
      styles: {
        backgroundColor: '#FF6E8B',
        color: '#ffffff',
      },
    });

    this.update({
      tagDate: tagDate.concat(selectedDate),
    });
  },
});

console.log(picker);
