export function getISOTimeString(date) {
    return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function getToday() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
}

export function getISODateString(date) {
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function getDayOfWeek(date) {
    const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    return days[date.getDay()];
}

export function getISODateTimeString(date) {
    var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
    return (new Date(date - tzoffset)).toISOString().slice(0, -1);
}

export function getDateFromISOTimeString(timeString) {
    const tokens = timeString.split(":");
    return new Date(1970, 0, 1, parseInt(tokens[0]), parseInt(tokens[1]), 0, 0);
}

function pad(number) {
    return number > 9 ? `${number}` : `0${number}`;
}