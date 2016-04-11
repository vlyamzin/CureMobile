import React, {
    AsyncStorage
} from 'react-native';
import _ from 'lodash';

const loginApi = "http://localhost:3000/api/user/log-in";
const tokenKey = "xAuthToken";
const userKey = "user";

class AuthService {
    constructor() {
        this.authStatus = {
            xAuthToken: null,
            user: null
        }
    }

    login(params) {
        let deferred = new Promise((resolve, reject) => {
            fetch(loginApi, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(params)
            })
                .then(response => {
                    return response.json();
                })
                .then(response => {
                    if (!response.success) {
                        this.setLoginStatus(false, null);
                        throw new Error(response.message);
                    }
                    this.setLoginStatus(response, resolve);
                })
                .catch(error => {
                    reject(error);
                });
        });

        return deferred;
    }

    getLoginStatus(callback) {
        if (this.authStatus['xAuthToken']) {
            callback(null, this.authStatus);
        } else {
            AsyncStorage.multiGet([tokenKey, userKey], (err, val) => {
                let parsedObj = {};
                if (err) {
                    return callback(err);
                }

                if (!val) {
                    return callback();
                }

                for(let i of val) {
                    parsedObj[i[0]] = i[1]
                }
                this.authStatus = parsedObj;
                return callback(null, parsedObj);
            })
        }

    }

    setLoginStatus(data, callback) {
        AsyncStorage.multiSet([
            [tokenKey, data.token],
            [userKey, JSON.stringify(data.user)]
        ], (err) => {
            if (err) {
                throw err;
            }
            callback()
        });
    }
}

module.exports = new AuthService();
