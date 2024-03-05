const { default: CreditCardGenerator } = require("@mihnea.dev/credit-card-generator");
const MaskData = require('maskdata');

const maskCardOptions = {
    // Character to mask the data. The default value is '*'
    maskWith: "*",

    // Should be positive Integer
    // If the starting 'n' digits need to be visible/unmasked
    // Default value is 4
    unmaskedStartDigits: 6,

    // Should be positive Integer
    // If the ending 'n' digits need to be visible/unmasked
    // Default value is 1. 
    unmaskedEndDigits: 4
};

const carder = new CreditCardGenerator()
/** Create a single card */
const card = carder.generate_one()
console.log(card);


const maskedData = MaskData.maskCard(card.number, maskCardOptions);
console.log(maskedData);


