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
      multiple: false,
      onChange: () => {},
    };

    this.click = this.click.bind(this);
    this.mousemove = this.mousemove.bind(this);
    this.closePicker = this.closePicker.bind(this);

    this.update(config);
    this.bindEvent();


    return {
      update: this.update.bind(this),
      getValue: () => $.extend(true, [], this.state.value),
    };
  }
  update(config) {
    const {
      // 渲染目标
      target = this.state.target,
      // 值
      value = this.state.value,
      // 最小日期
      minDate = this.state.minDate,
      // 最大日期
      maxDate = this.state.maxDate,
      // 标记日期
      tagDate = this.state.tagDate,
      // 显示多个日期控件，默认两个
      dates = this.state.dates,
      // 事件
      onChange = this.state.onChange,
      // 是否多选
      multiple = this.state.multiple,
    } = config;

    this.setState({
      target,
      // eslint-disable-next-line
      value: value ? value.map((v) => {
        return typeof v !== 'string' && v.length ? v.map(vi => moment(vi)) : moment(v);
      }) : [],
      minDate: minDate ? moment(minDate) : undefined,
      maxDate: maxDate ? moment(maxDate) : undefined,
      tagDate: this.renderTagDate(tagDate) || undefined,
      dates: dates || [moment(), moment().add(1, 'month')],
      onChange,

      startDate: null,
      endDate: null,
      moveEndDate: null,

      // 多选
      multiple,
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
    return dates.length ? [dates.map(date => moment(date))] : dates;
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
      value,
      multiple,
    } = this.state;

    const dateHtmls = [];
    let newTagDate = tagDate.map(tag => ({
      ...tag,
      tag: true,
    }));

    if (multiple) {
      newTagDate = newTagDate.concat(value.map(v => ({
        date: v,
        active: true,
      })));
    } else if (value.length) {
      newTagDate.push({
        date: value,
        active: true,
      });
    }

    dates.forEach((date, index) => {
      dateHtmls.push(render({
        date,
        prevDate: dates[index - 1],
        nextDate: dates[index + 1],
        range: [startDate, endDate || moveEndDate],
        minDate,
        maxDate,
        tagDate: newTagDate,
        single: startDate && !endDate,
      }));
    });

    const html = tpl.render(monthsTpl, {
      dateHtmls,
    });

    this.html = $(html);

    if (this.bak_html_str !== html) {
      target.html(this.html);
    }

    this.bak_html_str = html;
  }
  destroy() {
    const {
      target,
    } = this.state;

    this.html.remove();
    target.unbind('click', this.click);
    target.unbind('mousemove', this.mousemove);
    $(window).unbind('click', this.closePicker);
  }
  // eslint-disable-next-line
  bindEvent() {
    const {
      target,
    } = this.state;

    target.bind('click', this.click);
    target.bind('mousemove', this.mousemove);
    $(window).bind('click', this.closePicker);
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
    this.onChange('date');
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
    this.onChange('date');
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
      multiple,
      value,
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
          value: multiple ? value : [],
        });
      } else if (startDate && !endDate) {
        this.setState({
          startDate,
          endDate: moment(target.attr('data-full-date')),
        });
        this.onChange('range');
      }
    } else if (e.type === 'mousemove' && startDate) {
      this.setState({
        moveEndDate: moment(target.attr('data-full-date')),
      });
    }
  }
  onChange(type) {
    const {
      startDate,
      endDate,
      dates,
      onChange,
      multiple,
    } = this.state;

    let {
      value,
    } = this.state;

    // 赋值
    this.state.value = value;

    if (type === 'range') {
      // eslint-disable-next-line
      const selectDate = [startDate, endDate].sort((a, b) => +(a._d) - +(b._d));

      if (multiple) {
        value.push(selectDate);
      } else {
        value = selectDate;
      }
      onChange.call(this, type, value);
    }
    if (type === 'date') {
      onChange.call(this, type, dates);
    }
  }
}
