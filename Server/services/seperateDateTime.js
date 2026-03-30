const separateDateTime = (dateString) => {
    const d = new Date(dateString);
    return {
        date: d.toLocaleDateString('en-IN'), 
        time: d.toLocaleTimeString('en-IN')  
    };
};

module.exports = {
    separateDateTime
}