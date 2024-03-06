require('./bootstrap.test');

require('./unit/Health.test');


// Controllers
require('./unit/controllers/UserController.test');
require('./unit/controllers/PaymentController.test');


// Services
require('./unit/services/CardService.test');
require('./unit/services/CryptoService.test');
require('./unit/services/LoggerService.test');
require('./unit/services/ResponseService.test');
require('./unit/services/UserService.test');
require('./unit/services/UtilityService.test');
require('./unit/services/WalletService.test');
require('./unit/services/LedgerService.test');
require('./unit/services/PaymentService.test');
require('./unit/services/TransactionService.test');
require('./unit/services/AuthService.test');
require('./unit/services/JoiService.test');