import moment from 'moment';
import $ from 'jquery';
import tpl from 'tpl';

import './less/index.less';
import render from './js/render';
import monthsTpl from './tpl/months.html';

import {
  LowerCase,
} from './js/render/styles';

export default class Picker {
  constructor(config = {}) {
    this.state = {
      target: $('body'),
      onChange: () => {},
    };

    this.update(config);
    this.bindEvent();

    return {
      update: this.update.bind(this),
    };
  }
  update(config) {
    const {
      target = this.state.target,
      minDate = this.state.minDate,
      maxDate = this.state.maxDate,
      tagDate = this.state.tagDate,
      dates = this.state.dates,
      onChange = this.state.onChange,
    } = config;

    this.setState({
      target,
      minDate: minDate ? moment(minDate) : undefined,
      maxDate: maxDate ? moment(maxDate) : undefined,
      tagDate: this.renderTagDate(tagDate) || undefined,
      dates: dates || [moment(), moment().add(1, 'month')],
      onChange,

      startDate: null,
      endDate: null,
      moveEndDate: null,
    });
  }
  // eslint-disable-next-line
  renderTagDate(dates) {
    if (!dates) {
      return undefined;
    }
    if (dates[0] && typeof dates[0] !== 'string' && dates[0].length) {
      return dates.map(date => date.map(d => moment(d)));
    }
    if (dates[0] && typeof dates[0] !== 'string' && !dates[0].length) {
      return dates.map(d => ({
        ...d,
        date: d.date.map(da => moment(da)),
        styles: this.convertStyles(d.styles || {}),
      }));
    }
    return [dates.map(date => moment(date))];
  }
  // eslint-disable-next-line
  convertStyles(styles) {
    return LowerCase(styles);
  }
  setState(state) {
    this.state = {
      ...this.state,
      ...state,
    };
    this.updateView();
  }
  // eslint-disable-next-line
  updateView() {
    const {
      target,
      dates,
      startDate,
      endDate,
      moveEndDate,
      minDate,
      maxDate,
      tagDate,
    } = this.state;

    const dateHtmls = [];

    dates.forEach((date, index) => {
      dateHtmls.push(render({
        date,
        prevDate: dates[index - 1],
        nextDate: dates[index + 1],
        range: [startDate, endDate || moveEndDate],
        minDate,
        maxDate,
        tagDate,
        single: startDate && !endDate,
      }));
    });

    const html = tpl.render(monthsTpl, {
      dateHtmls,
    });

    if (this.bakHtml !== html) {
      target.html(html);
    }

    this.bakHtml = html;
  }
  // eslint-disable-next-line
  bindEvent() {
    const {
      target,
    } = this.state;

    target.bind('click', this.click.bind(this));
    target.bind('mousemove', this.mousemove.bind(this));
    $(window).bind('click', this.closePicker.bind(this));
  }
  // eslint-disable-next-line
  closePicker() {
    this.setState({
      startDate: null,
      endDate: null,
    });
  }
  // eslint-disable-next-line
  click(e) {
    const target = $(e.target);
    const type = target.attr('data-type');

    e.stopPropagation();

    if (type === 'date') {
      this.dateClick(e);
    }
    if (type === 'prev-month') {
      this.prevMonth(e);
    }
    if (type === 'next-month') {
      this.nextMonth(e);
    }
  }
  prevMonth(e) {
    const target = $(e.target);
    const {
      dates,
    } = this.state;
    const index = target.parent().parent().parent().index();

    dates[index] = dates[index].add(-1, 'month');

    this.setState({
      dates,
    });
  }
  nextMonth(e) {
    const target = $(e.target);
    const {
      dates,
    } = this.state;
    const index = target.parent().parent().parent().index();

    dates[index] = dates[index].add(1, 'month');

    this.setState({
      dates,
    });
  }
  mousemove(e) {
    const target = $(e.target);
    const type = target.attr('data-type');

    if (type === 'date') {
      this.dateClick(e);
    }
  }
  dateClick(e) {
    const target = $(e.target);
    const {
      startDate,
      endDate,
    } = this.state;
    if (target.attr('data-disabled') === 'true') {
      return;
    }
    if (e.type === 'click') {
      if ((!startDate && !endDate) || (startDate && endDate)) {
        this.setState({
          startDate: moment(target.attr('data-full-date')),
          endDate: undefined,
          moveEndDate: undefined,
        });
      } else if (startDate && !endDate) {
        this.setState({
          startDate,
          endDate: moment(target.attr('data-full-date')),
        });
        this.onChange();
      }
    } else if (e.type === 'mousemove' && startDate) {
      this.setState({
        moveEndDate: moment(target.attr('data-full-date')),
      });
    }
  }
  onChange() {
    const {
      startDate,
      endDate,
      onChange,
    } = this.state;

    onChange.call(this, [startDate, endDate]);
  }
}
