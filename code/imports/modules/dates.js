import moment from 'moment';

export const epochToHuman = epoch => moment.unix(epoch).format('MMMM Do, YYYY');
