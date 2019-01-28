// Imports
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SIGN_SECRET = process.env.JWT_SIGN_SECRET

// Exported functions
module.exports = {
    generateTokenForUser: userData => {
        return jwt.sign({
            userId: userData.id,
            role: userData.role
        },
        JWT_SIGN_SECRET,
        {
            expiresIn: '1h'
        })
    },
    
    GenerateTokenForRegister: registerData => {
        return jwt.sign({
            email: registerData.email,
            password: registerData.password,
            gender: registerData.gender,
            age_range: registerData.age_range,
            seniority: registerData.seniority,
            role: registerData.role,
            is_active: registerData.is_active,
            business_focus: registerData.business_focus,
            agencyId: registerData.agencyId,
            companyId: registerData.companyId,
            poleId: registerData.poleId,
        },
        JWT_SIGN_SECRET,
        {
            expiresIn: '1h'
        })
    },

    parseAuthorization: authorization => {
        return (authorization != null) ? authorization.replace('Bearer ', '') : null;
    },

    getUserRole: authorization => {
        let userRole = null;
        let token = module.exports.parseAuthorization(authorization);
        if(token !== "null") {
            let jwtToken = jwt.verify(token, JWT_SIGN_SECRET)

            if(jwtToken !== null)
                userRole = jwtToken.role;
            
        }
        let hasRole = userRole === "client" || userRole === "admin" || userRole === "super_admin"
        return hasRole ? userRole : "visitor";
    },

    getUserId: authorization => {
        let userId = null;
        let token = module.exports.parseAuthorization(authorization);

        if(token != null) {
            let jwtToken = jwt.verify(token, JWT_SIGN_SECRET);

            if(jwtToken != null)
                userId = jwtToken.userId;
        }
        return userId;
    },

    getRegisterData: authorization => {
        let registerData = null;
        //let token = module.exports.parseAuthorization(authorization);
        let token = authorization;

        if(token != null) {
            let jwtToken = jwt.verify(token, JWT_SIGN_SECRET);

            if(jwtToken != null)
                registerData = jwtToken;
        }
        return registerData;
    },

    requireRole: role => {
        return (req, res, next) => {
            const userRole = "visitor"; 
            const roles = ["visitor","client","admin","super_admin"];
            
            if(req.headers['authorization'] !== undefined) {
                const headerAuth = req.headers['authorization'];
                userRole = module.exports.getUserRole(headerAuth);
            }

            const userRoleId = roles.indexOf(userRole);
            const roleMinId = roles.indexOf(role);
        
            if (userRoleId >= roleMinId) {
                next();
            } else {
                res.send(403);
            }
        }
    }
}