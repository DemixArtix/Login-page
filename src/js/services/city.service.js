import axios from '../plugins/axios';

/**
 *Function login. Make login request to API
 * @param {String}email
 * @param {String}password
 * @returns {Promise<void>}
 */
export async function getCities(countryCode) {
    try {
        const response =  await axios.get(
            `location/get-cities/${countryCode}`
        );

        console.log(response);
        return response;
    }catch (err) {
        console.log(err);
        return Promise.reject(err);
    }
}
