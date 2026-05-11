import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import calendar from 'dayjs/plugin/calendar';
import updateLocale from 'dayjs/plugin/updateLocale';

dayjs.extend(relativeTime);
dayjs.extend(calendar);
dayjs.extend(updateLocale);

export const formatChatTimestamp = (date: Date | string | number) => {
  if (!date) return '';
  let d = dayjs(date);
  
  // CRITICAL: Handle numeric strings from sockets to avoid parsing as YYYYMMDD (e.g. 1778...)
  if (typeof date === 'string' && !isNaN(Number(date)) && date.length > 8) {
    d = dayjs(Number(date));
  }
  
  if (!d.isValid()) return '';

  const now = dayjs();
  if (d.isSame(now, 'day')) return d.format('hh:mm a');
  if (d.isSame(now.subtract(1, 'day'), 'day')) return 'Yesterday';
  if (d.isAfter(now.subtract(7, 'days'))) return d.format('dddd');
  return d.format('D MMM');
};

export const formatMessageTimestamp = (date: Date | string | number) => {
  if (!date) return '';
  let d = dayjs(date);

  if (typeof date === 'string' && !isNaN(Number(date)) && date.length > 8) {
    d = dayjs(Number(date));
  }

  if (!d.isValid()) return '';
  return d.format('hh:mm a');
};

export const formatDateSeparator = (date: Date | string | number) => {
  if (!date) return '';
  let d = dayjs(date);

  if (typeof date === 'string' && !isNaN(Number(date)) && date.length > 8) {
    d = dayjs(Number(date));
  }

  if (!d.isValid()) return '';

  const now = dayjs();
  
  if (d.isSame(now, 'day')) return 'Today';
  if (d.isSame(now.subtract(1, 'day'), 'day')) return 'Yesterday';
  
  // If within last 7 days, show weekday
  const diffDays = now.diff(d, 'day');
  if (diffDays < 7) {
    return d.format('dddd');
  }

  return d.format('MMMM D, YYYY');
};
