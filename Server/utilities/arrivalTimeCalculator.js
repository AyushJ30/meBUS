const calculateArrivalTime = (startTime, duration) => {
    // 1. Split strings (HH:mm:ss) into numbers
    const [sH, sM] = startTime.split(':').map(Number);
    const [dH, dM] = duration.split(':').map(Number);

    // 2. Create a base date (today) and set the start time
    const date = new Date();
    date.setHours(sH, sM, 0, 0);

    // 3. Add the duration hours and minutes
    date.setHours(date.getHours() + dH);
    date.setMinutes(date.getMinutes() + dM);

    // 4. Format back to HH:mm (24-hour format)
    const arrivalHours = String(date.getHours()).padStart(2, '0');
    const arrivalMinutes = String(date.getMinutes()).padStart(2, '0');

    return `${arrivalHours}:${arrivalMinutes}`;
};

module.exports = {
    calculateArrivalTime
}