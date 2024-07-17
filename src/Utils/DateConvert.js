import moment from 'moment-timezone'

 const convertToIST = async (Date) => {
     return moment(Date).tz('Asia/Kolkata').format('YYYY-MM-DD');
    
};
export default convertToIST