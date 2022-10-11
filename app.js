if (process.env.NODE_ENV === 'local' || process.env.NODE_ENV === 'dev') {
    // eslint-disable-next-line global-require
    require('dotenv').config({
        path: `./${process.env.NODE_ENV}.env`,
    });
}

const express = require('express');

const app = express();
const helmet = require('helmet');
const morgan = require('morgan');
const userAgent = require('express-useragent');
const bodyParser = require('body-parser');
const boom = require('@hapi/boom');
const path = require('path');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const initScope = require('./system/middleware/init-scope');
// const initReqUser = require('./system/middleware/init-req-user');
const logError = require('./system/middleware/log-error');
const errorHandler = require('./system/error/handler');
const swaggerSpec = require('./docs');
const middlewareConfig = require('./system/config/middleware');
const firebaseApi = require('./system/lib/firebase/index');

// api routes folder path
const authRoutes = require('./api/Auth/route');
const adminAuthRoutes = require('./api/adminAuth/route');
const configRoutes = require('./api/Config/route');
const adminUserRoutes = require('./api/adminUser/route');
const userRoutes = require('./api/User/route');
const categoryRoutes = require('./api/Categories/route');
const itemRoutes = require('./api/item/route');
const cartRoutes = require('./api/Cart/route');
const reportRoutes = require('./api/Report/route');
const savedAddressRoutes = require('./api/savedAddress/route');
const orderRoutes = require('./api/order/route');
const pushNotificationRoutes = require('./api/pushNotification/route');
const appAdminInfoRoutes = require('./api/appUserInfo/route');
const wishListRoutes = require('./api/wishList/route');

app.use('/item-uploads', express.static(path.join(__dirname, '/item-uploads')));
app.use('/profile-uploads', express.static(path.join(__dirname, '/profile-uploads')));

app.use(userAgent.express());
app.use(cors(middlewareConfig.cors));
app.use(helmet());
app.use(morgan(middlewareConfig.morganRequestFormat));
app.use(bodyParser.urlencoded({
    extended: true,
}));
app.use(bodyParser.json());
if (process.env.NODE_ENV.localeCompare('prod') !== 0) {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
        explorer: true,
    }));
}

// public routes
app.get('/', (req, res) => {
    res.send({
        message: 'success',
    });
});
app.get('/api/health', (req, res) => {
    res.send('Mercury Toy Health is OK.');
});

app.use(middlewareConfig.tenantCheck);

// protected routes
app.use(firebaseApi.verifyIdToken);

app.use(initScope);
app.use('/api/auth', authRoutes);
app.use('/api/admin-auth', adminAuthRoutes);
app.use('/api/admin-user', adminUserRoutes);
app.use('/api/user', userRoutes);
app.use('/api/config', configRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/item', itemRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/report', reportRoutes);
app.use('/api/saved-address', savedAddressRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/app-admin-info', appAdminInfoRoutes);
app.use('/api/push-notification', pushNotificationRoutes);
app.use('/api/wish-list', wishListRoutes);

// eslint-disable-next-line no-unused-vars
app.use((req, res, next) => {
    throw boom.notFound('Endpoint Not Found');
});
app.use(logError);
app.use(errorHandler.token);
app.use(errorHandler.validation);
app.use(errorHandler.all);

module.exports = app;