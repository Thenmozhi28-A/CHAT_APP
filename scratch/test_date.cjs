const dayjs = require('dayjs');
const ts = 1778061874220;
console.log('Timestamp:', ts);
console.log('Date:', dayjs(ts).format('MMMM D, YYYY'));
console.log('Date String:', dayjs("1778061874220").format('MMMM D, YYYY'));
console.log('Date Number String:', dayjs(Number("1778061874220")).format('MMMM D, YYYY'));
