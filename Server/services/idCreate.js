
function createID(name){
    const Name = name.trim();
    let f;
    let s;

    if(Name.length > 2){
        f = Name.charAt(0).toUpperCase();
        if(Name.includes(' ')){
            const part = Name.split(' ');
            s = part[1].charAt(0).toUpperCase();
        } else{
            s = Name.charAt(1).toUpperCase();
        }
    }

    const ID = f+s;
    return ID;
}

module.exports = {
    createID,
}