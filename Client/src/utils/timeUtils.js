
export const formatTime = (timeString) => {
    if (!timeString) return "N/A";
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0);
    
    return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: true 
    });
};

export const calculateArrival = (startTime, duration) => {
    if (!startTime || !duration) return "N/A";

    const [startHours, startMins] = startTime.split(':').map(Number);
    const [durHours, durMins] = duration.split(':').map(Number);

    const date = new Date();
    date.setHours(startHours + durHours, startMins + durMins, 0);

    return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: true 
    });
};