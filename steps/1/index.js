globalThis.app ||= {};
app.hot = module.hot;
app.hash = () => __webpack_hash__;
require('./keeper');
app.load = () => import(/* webpackChunkName: 'moved' */ './dep');
module.hot.accept();
