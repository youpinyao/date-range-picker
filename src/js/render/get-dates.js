import moment from 'moment';
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
  let styles = {};

  if (tagDateMill) {
    tagDateMill.forEach((items) => {
      if (items.styles) {
        if (dateMill >= items.date[0] && dateMill <= items.date[1]) {
          // disabled = true;
          styles = {
            ...styles,
            ...items.styles,
          };
        }
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
    day: date.day(),
    date: date.date(),
    fullDate: date.format(YYYYMMDD),
    active,
    disabled,
    single,
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
    return d.styles ? {
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
