const _ = require('lodash');
const Chance = require('chance');

const chance = new Chance();


const UtilityService = {
   generateRandomNumber: (minValue = 1000000000, maxValue = 9999999999, pad = '0000000000') => {
      if (minValue < 0 || maxValue < 0) {
         return 0;
      }

      if (minValue >= maxValue) {
         return 0;
      }

      const randomNumber = `${_.random(minValue, maxValue)}`;
      return pad.substring(0, pad.length - randomNumber.length) + randomNumber;
   },
   generateRandomString: (length = 36, casing = 'lower') => {
      if ((typeof length) !== 'number') {
         return '';
      }

      if (length < 0) {
         return ''
      }

      if (!['lower', 'upper', 'mixed'].includes(casing)) {
         return '';
      }

      return chance.string({ length, casing, alpha: true, numeric: true });
   },
};

module.exports = UtilityService;