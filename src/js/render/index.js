import tpl from 'tpl';
import getDates from './get-dates';
import monthTpl from '../../tpl/month.html';

import {
  YYYYMMDD,
} from './format';

export default function ({
  index,
  date,
  prevDate,
  nextDate,
  range: [startDate, endDate],
  minDate,
  maxDate,
  tagDate,
  single = false,
}) {
  const dates = getDates({
    date,
    startDate,
    endDate,
    minDate,
    maxDate,
    tagDate,
    single,
  });
  const firstDay = dates[0].day || 7;
  const lastDay = dates[dates.length - 1].day;

  for (let i = 1; i < firstDay; i += 1) {
    dates.unshift({});
  }
  if (lastDay !== 0) {
    for (let i = lastDay; i < 7; i += 1) {
      dates.push({});
    }
  }

  return tpl.render(monthTpl, {
    index,
    year: date.format('YYYY'),
    month: date.format('MM'),
    title: date.format(YYYYMMDD),
    // eslint-disable-next-line
    prevDate: prevDate ? moment(prevDate._d).add(1, 'month').format(YYYYMMDD) : undefined,
    // eslint-disable-next-line
    nextDate: nextDate ? moment(nextDate._d).add(-1, 'month').format(YYYYMMDD) : undefined,
    dates,
  });
}
