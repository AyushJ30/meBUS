const {ApiError} = require('../utilities/ApiError');

function userSignupVer(name, age, gender, email, password, phone, file){

    if(!name || !age || !gender || !email || !password || !phone || !file){
        throw new ApiError(400, "Missing Fields in the Form");
    }

    if(email){
        if(!email.includes('@')){
            throw new ApiError(406, "Invalid Email Field");
        } else{
            const domain = email.split('@');
            if(!domain[1].includes('.')){
                throw new ApiError(406, "Invalid Email Field");
            } else{
                const tld = domain[1].split('.');
                if(tld[1].length < 2){
                    throw new ApiError(406, "Invalid Email Field");
                } else{
                    return;
                }
            }
        }
    }
}

function adminSignupVer(name, age, gender, email, password, phone, file, res){
    if(!name){
        res.status(400).render('register', {
            errorMessage: "Missing Name Field"
        });
        return false;
    }

    if(!age){
        res.status(400).render('register', {
            errorMessage: "Missing Age Field"
        });
        return false;
    }

    if(!gender){
        res.status(400).render('register', {
            errorMessage: "Missing Gender Field"
        });
        return false;
    }

    if(!email){
        res.status(400).render('register', {
            errorMessage: "Missing Email Field"
        });
        return false;
    }

    if(!password){
        res.status(400).render('register', {
            errorMessage: "Missing Password Field"
        });
        return false;
    }

    if(!phone){
        res.status(400).render('register', {
            errorMessage: "Missing Phone Field"
        });
        return false;
    }

    if(!file){
        res.status(400).render('register', {
            errorMessage: "Missing File Field"
        });
        return false;
    }

    if(email){
        if(!email.includes('@')){
            res.status(400).render('register', {
                errorMessage: "Missing Email Field"
            });
            return false;
        } else{
            const domain = email.split('@');
            if(!domain[1].includes('.')){
                res.status(400).render('register', {
                    errorMessage: "Missing Email Field"
                });
                return false;
            } else{
                const tld = domain[1].split('.');
                if(tld.length < 2){
                    res.status(400).render('register', {
                        errorMessage: "Missing Email Field"
                    });
                    return false;
                } else{
                    return true;
                }
            }
        }
    }

}

function adminLoginVer(email, password, res){
    
    if(!email){
        res.status(400).render('login', {
            errorMessage: "Missing Email Field"
        });
        return false;
    }

    if(!password){
        res.status(400).render('login', {
            errorMessage: "Missing Password Field"
        });
        return false;
    }

    if(email){
        if(!email.includes('@')){
            res.status(400).render('login', {
                errorMessage: "Missing Email Field"
            });
            return false;
        } else{
            const domain = email.split('@');

            if(!domain[1].includes('.')){
                res.status(400).render('login', {
                    errorMessage: "Missing Email Field"
                });
                return false;
            } else{
                const tld = domain[1].split('.');
                if(tld[1].length < 2){
                    res.status(400).render('login', {
                        errorMessage: "Missing Email Field"
                    });
                    return false;
                } else{
                    return true;
                }
            }
        }
    }
}

function userLoginVer(email, password){
    if(!email || !password){
        throw new ApiError(400, "Missing Fields");
    }

    if(email){
        if(!email.includes('@')){
            throw new ApiError(406, "Missing Fields");
        } else{
            const domain = email.split('@');
            if(!domain[1].includes('.')){
                throw new ApiError(406, "Missing Fields");
            } else{
                const tld = domain[1].split('.');
                if(tld[1].length < 2){
                    throw new ApiError(406, "Missing Fields");
                } else{
                    return;
                }
            }
        }
    }
}

function busBookVer(userId, busId, passengerId){
    if(!userId){
        throw new ApiError(400, "Missing User ID");
    }

    if(!busId){
        throw new ApiError(400, "Missing Bus ID");
    }

    if(!passengerId){
        throw new ApiError(400, "Missing Passenger ID");
    }

    return;
}

function passengerVer(name, age, gender, email, phone, busId){
    if(!name){
        throw new ApiError(400, "Missing Name Field");
    }

    if(!age){
        throw new ApiError(400, "Missing Age Field");
    }

    if(!gender){
        throw new ApiError(400, "Missing Gender Field");
    }

    if(!email){
        throw new ApiError(400, "Missing Email Field");
    }

    if(!phone){
        throw new ApiError(400, "Missing Phone Field");
    }

    if(!busId){
        throw new ApiError(400, "Missing Bus ID");
    }
}

module.exports = {
    userSignupVer,
    adminSignupVer,
    userLoginVer,
    busBookVer,
    adminLoginVer,
    passengerVer
}