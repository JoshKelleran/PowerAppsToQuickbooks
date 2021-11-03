import OAuthClient from 'intuit-oauth';
import express from 'express';
import { PowerApp } from './PowerApp';
import path from 'path';
import { QuickbooksSync } from './QuickbooksSync';
// import { Configuration } from './Configuration';
// import { Config } from './WootEnums';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '../website')));
// eslint-disable-next-line @typescript-eslint/no-var-requires
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// Global variables
let qbSync: QuickbooksSync | null = null;
let oAuthClient: OAuthClient | null = null;
let oauth2_token_json: string | null = null;
// let redirectUri = '';

/**
 * Home Route
 */
app.get('/', function (req, res) {
    res.render('index');
});

/**
 * Get the AuthorizeUri
 */
app.get('/authUri', function (req: express.Request, res: express.Response) {
    oAuthClient = new OAuthClient({
        clientId: (req.query as any).json.clientId,  // req.query.json.clientId,
        clientSecret: (req.query as any).json.clientSecret,
        environment: (req.query as any).json.environment,
        redirectUri: (req.query as any).json.redirectUri
    });

    const authUri = oAuthClient.authorizeUri({
        scope: ['com.intuit.quickbooks.accounting'],
        state: 'intuit-test',
    });

    const baseUrl = (oAuthClient.environment == 'sandbox' ? OAuthClient.environment.sandbox : OAuthClient.environment.production);
    qbSync = new QuickbooksSync(oAuthClient, baseUrl, new PowerApp());
    res.send(authUri);
});

/**
 * Handle the callback to extract the `Auth Code` and exchange them for `Bearer-Tokens`
 */
app.get('/callback', function (req: express.Request, res: express.Response) {
    if (oAuthClient == null) {res.send('No valid connection to quickbooks.'); return;}
    oAuthClient
        .createToken(req.url)
        .then(function (authResponse: any) {
            oauth2_token_json = JSON.stringify(authResponse.getJson(), null, 2);
        })
        .catch(function (e) {
            console.error(e);
        });

    res.send('');
});

/**
 * Display the token : CAUTION : JUST for sample purposes
 */
app.get('/retrieveToken', function (req: express.Request, res: express.Response) {
    res.send(oauth2_token_json);
});

/**
 * getCustomers ()
 */
app.get('/getCustomers', async function (req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
        if (!qbSync) {res.send('No valid connection to quickbooks.'); return;}
        const result = await qbSync.getCustomersQB();
        res.send(result);
    }
    catch(e) {
        return next(e);
    }
});


/**
 * getOrders ()
 */
app.get('/getOrders', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        if (!qbSync?.app) {res.send('No PowerApp connection.'); return;}
        const result = await qbSync.getOpenOrders();
        res.send(result);
    }
    catch(e) {
        return next(e);
    }
});

app.listen(3000, () => {
    console.log('The application is listening on port 3000!');
});

/**
 * syncQuickbooks()
 */
app.get('/syncQuickbooks', async function (req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
        if (!qbSync) {res.send('No valid connection to quickbooks.'); return;}
        const result = await qbSync.sync();
        res.send(result);
    }
    catch(e) {
        return next(e);
    }
});