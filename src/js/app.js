import 'bootstrap/dist/css/bootstrap.css';
import '../css/style.css';
import UI from "./config/ui.config";
import regUI from "./config/reg.ui.confog";
import {validate} from "./helpers/validate";
import {removeInputError, showInputError} from "./views/form";
import {login} from "./services/auth.service";
import {registration} from "./services/reg.service";
import {notify} from "./views/notifications";
import {getNews} from "./services/news.service";
import {getCountries} from "./services/countries.service";
import {getCities} from "./services/city.service";

//denis.m.pcspace@gmail.com
//dmgame12345

let countriesForAutocomplete = [];
let objOfCountries = {};
(async function arrOfCountries() {
    const countries = await getCountries();
    Object.entries(countries).forEach(([number, country], index) => {
        // console.log(number, country, index);
        countriesForAutocomplete.push(country);
        Object.defineProperty(objOfCountries, country, {
            value: number,
            enumerable: true,
            configurable: true,
            writable: true,
            });
        });
    return countries;
})();




$( function() {
    $( "#regCountry" ).autocomplete({
        source: countriesForAutocomplete
    });
} );

const { form, inputEmail, inputPassword } = UI;
const { regForm,
    regEmail,
    regPassword,
    regNickname,
    regFirstName,
    regLastName,
    regPhone,
    regGender,
    regCountry,
    regCity,
    regBirthDate
} = regUI;



const inputs = [inputEmail, inputPassword];
const regInputs =
    [regForm,
    regEmail,
    regPassword,
    regNickname,
    regFirstName,
    regLastName,
    regPhone,
    regGender,
    regCountry,
    regCity,
    regBirthDate];

//Events

form.addEventListener('submit', e => {
    e.preventDefault();
    onSubmit();
});

regForm.addEventListener('submit', e => {
    e.preventDefault();
    onRegSubmit();
    console.log(regBirthDate.value.split('-').reverse()[0]);
});
let cities = [];
regCountry.addEventListener('change', async e => {
    if(cities.length) {
        cities.length = 0;
    }
    const countryCode = objOfCountries[regCountry.value];
    const response = await getCities(countryCode);
    response.forEach(city => {
        cities.push(city);
    });



});

$( function() {
    $( "#regCity" ).autocomplete({
        source: cities
    });
} );

inputs.forEach(el => el.addEventListener('focus', () => removeInputError(el)));

regInputs.forEach(el => el.addEventListener('focus', () => removeInputError(el)));

//Handlers

async function onSubmit() {
    const isValidForm = inputs.every(el => {
        const isValidInput = validate(el);
        if(!isValidInput) {
            if(el.parentElement.querySelector('.invalid-feedback')){
                return
            }else {
                showInputError(el);
            }
        }

        return isValidInput;
    });

    if(!isValidForm) return;

    try {
        await login(inputEmail.value, inputPassword.value);
        await getNews();
        form.reset();
        notify({msg: 'Login success', className: 'alert-success', timeout: 1000});
    }catch (err) {
        notify({msg: "Login failed", className: 'alert-danger', timeout: 1000});
    }
}

async function onRegSubmit() {
    const arrOfBirthDate = regBirthDate.value.split('-').reverse();
    const day = arrOfBirthDate[0];
    const month = arrOfBirthDate[1];
    const year = arrOfBirthDate[2];
    const isValidForm = regInputs.every(el => {
        const isValidInput = validate(el);
        if(!isValidInput) {
            if(el.parentElement.querySelector('.invalid-feedback')){
                return
            }else {
                showInputError(el);
            }
        }

        return isValidInput;
    });

    if(!isValidForm) return;

    try {
        await registration(regEmail.value,
            regPassword.value,
            regNickname.value,
            regFirstName.value,
            regLastName.value,
            regPhone.value,
            regGender.value,
            regCity.value,
            regCountry.value,
            day, month, year
            );
        regForm.reset();
        notify({msg: 'Registration success', className: 'alert-success', timeout: 1000});
    }catch{
        notify({msg: "Registration failed", className: 'alert-danger', timeout: 1000});
    }
}

