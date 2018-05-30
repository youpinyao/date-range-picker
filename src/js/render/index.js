import tpl from 'tpl';
import getDates from './get-dates';
import monthTpl from '../../tpl/month.html';

import {
  YYYYMM,
} from './format';

export default function ({
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
    title: date.format(YYYYMM),
    // eslint-disable-next-line
    prevDate: prevDate ? moment(prevDate._d).add(1, 'month').format(YYYYMM) : undefined,
    // eslint-disable-next-line
    nextDate: nextDate ? moment(nextDate._d).add(-1, 'month').format(YYYYMM) : undefined,
    dates,
  });
}
