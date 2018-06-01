
import {
  YYYYMMDD,
} from './format';

function getDate({
  date,
  startDateMill,
  endDateMill,
  minDateMill,
  maxDateMill,
  tagDateMill,
  single,
}) {
  // eslint-disable-next-line
  const dateMill = (+date._d);
  let active = startDateMill && endDateMill &&
    ((dateMill >= startDateMill && dateMill <= endDateMill) ||
      (dateMill <= startDateMill && dateMill >= endDateMill));

  if (startDateMill && !endDateMill && dateMill === startDateMill) {
    active = true;
  }

  let disabled = false;
  let piece = false;
  let styles = {};

  if (tagDateMill) {
    tagDateMill.forEach((items) => {
      if (items.tag && dateMill >= items.date[0] && dateMill <= items.date[1]) {
        // disabled = true;
        piece = !!items.piece;
        styles = {
          ...styles,
          ...items.styles,
        };
      } else if (items.active && dateMill >= items.date[0] && dateMill <= items.date[1]) {
        active = true;
      } else if (dateMill >= items[0] && dateMill <= items[1]) {
        disabled = true;
      }
    });
  }

  if (minDateMill && dateMill < minDateMill) {
    disabled = true;
  }
  if (maxDateMill && dateMill > maxDateMill) {
    disabled = true;
  }

  return {
    // 星期
    day: date.day(),
    // 日期 天
    date: date.date(),
    // 日期 全
    fullDate: date.format(YYYYMMDD),
    // 选中状态
    active,
    // 不可点击
    disabled,
    // 选择中
    // eslint-disable-next-line
    single: single ? ((dateMill >= (+single[0]._d) && dateMill <= (+single[1]._d)) || dateMill <= (+single[0]._d) && dateMill >= (+single[1]._d)) : false,
    // 显示部分色块
    piece,
    // 样式
    styles: Object.keys(styles).map(key => `${key}:${styles[key]}`).join(';'),
  };
}

export default function ({
  date,
  startDate,
  endDate,
  minDate,
  maxDate,
  tagDate,
  single,
}) {
  // eslint-disable-next-line
  date = moment(date._d);
  const firstDate = date.date(1).hour(0).minute(0).second(0)
    .millisecond(0);
  // eslint-disable-next-line
  const startDateMill = startDate ? (+startDate.hour(0).minute(0).second(0)
    .millisecond(0)._d) : undefined;
  // eslint-disable-next-line
  const endDateMill = endDate ? (+endDate.hour(0).minute(0).second(0)
    .millisecond(0)._d) : undefined;
  // eslint-disable-next-line
  const minDateMill = minDate ? (+minDate.hour(0).minute(0).second(0)
    .millisecond(0)._d) : undefined;
  // eslint-disable-next-line
  const maxDateMill = maxDate ? (+maxDate.hour(0).minute(0).second(0)
    .millisecond(0)._d) : undefined;
  // eslint-disable-next-line
  const tagDateMill = tagDate ? tagDate.map(d => {
    return d.tag || d.active ? {
      ...d,
      // eslint-disable-next-line
      date: [+(d.date[0].hour(0).minute(0).second(0).millisecond(0)._d), +(d.date[1].hour(0).minute(0).second(0).millisecond(0)._d)],
      // eslint-disable-next-line
    } : +(d.hour(0).minute(0).second(0).millisecond(0)._d);
  }) : undefined;

  const dates = [getDate({
    date: firstDate,
    startDateMill,
    endDateMill,
    minDateMill,
    maxDateMill,
    tagDateMill,
    single,
  })];

  firstDate.add(1, 'days');

  while (firstDate.date() > 1) {
    dates.push(getDate({
      date: firstDate,
      startDateMill,
      endDateMill,
      minDateMill,
      maxDateMill,
      tagDateMill,
      single,
    }));
    firstDate.add(1, 'days');
  }

  return dates;
}
