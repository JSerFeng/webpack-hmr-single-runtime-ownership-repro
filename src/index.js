globalThis.app ||= {};
app.hot = module.hot;
app.hash = () => __webpack_hash__;
require('./keeper');
app.initial = require('./dep');
module.hot.accept();
