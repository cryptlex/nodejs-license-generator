const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');

const CryptlexApi = require('./Cryptlex/CryptlexApi');

const app = new Koa();
const router = new Router();
const port = process.env.PORT || 3000;

// add exception handler
app.use(async function (ctx, next) {
    try {
        await next();
    } catch (error) {
        console.error(error);
        ctx.status = error.status || 500;
        ctx.body = { message: error.message || 'Oops! Something is broken!' }
    }
});

// add body parser
app.use(bodyParser());

router.post('/license', async (ctx) => {
    const productId = 'PASTE_YOUR_PRODUCT_ID';

    // get post params from request body
    const { email, first_name, last_name, order_id } = ctx.request.body;

    // create license user
    const userBody = {
        email: email,
        firstName: first_name,
        lastName: last_name,
        password: 'top_secret', // make sure you change logic for setting the password
        role: 'user'
    };
    const user = await CryptlexApi.createUser(userBody);

    // create license
    const licenseBody = {
        productId: productId,
        userId: user.id,
        metadata: []
    };
    licenseBody.metadata.push({ key: 'order_id', value: order_id, visible: false });
    const license = await CryptlexApi.createLicense(licenseBody);

    console.log("license created successfully!")
    // return license key to payment processor
    ctx.body = license.key;
});

router.post('/renew-license', async (ctx) => {
    const productId = 'PASTE_YOUR_PRODUCT_ID';

    // get post params from request body
    const { order_id } = ctx.request.body;

    // renew license expiry
    const license = await CryptlexApi.renewLicense(productId, 'order_id', order_id);

    // return new expiry date
    ctx.body = { message: `License new expiry date: ${license.expiresAt}` }
});


// add the routes
app.use(router.routes()).use(router.allowedMethods());
// start the server
app.listen(process.env.PORT || 3000);
console.log(`Listening on port: ${port}`);
