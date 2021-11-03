/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import * as adal from 'adal-node';
import DynamicsWebApi from 'dynamics-web-api';

export class PowerApp {
    private authorityUrl: string;
    private resource: string;
    private clientId: string;
    private clientSecret: string;
    private adalContext: adal.AuthenticationContext;
    private apiUrl: string;
    public api : DynamicsWebApi;

    constructor(){
        // Constants (Azure key expires every 2 years)
        const azureTenantId = 'e393f57a-ee89-483a-8276-c1234138c4fb';
        const azureClientId = 'cba48857-4ce3-43c9-9f6e-c6978657c050';
        const dynamicsHost = 'orgf992c4ee.crm.dynamics.com';
        const dynamicsSecret = 'LJ75wtVHMS8wUTUZn5~1GcRSvTk2G-u.-R';
        
        this.authorityUrl = `https://login.microsoftonline.com/${azureTenantId}/oauth2/token`;
        this.resource = `https://${dynamicsHost}/`;
        this.apiUrl   = dynamicsHost;
        this.clientId = azureClientId;
        this.clientSecret = dynamicsSecret;

        //create DynamicsWebApi object
        this.api = new DynamicsWebApi({
            webApiUrl: `https://${this.apiUrl}/api/data/v9.1/`,
            includeAnnotations: 'OData.Community.Display.V1.FormattedValue',
            useEntityNames: true,
            onTokenRefresh: this.acquireTokens
        });
        this.adalContext = new adal.AuthenticationContext(this.authorityUrl);

    }

    public acquireTokens = (dynamicsCallback: any) => {

        const adalCallback = (error:any, token:any) => {
    
            if (!error){
                //call DynamicsWebApi callback only when a token has been retrieved
                dynamicsCallback(token);
            }
            else{
                console.log('Token has not been retrieved. Error: ' + error.stack);
            }
        
        };
    
        // this.adalContext.acquireTokenWithUsernamePassword(this.resource, this.username, this.password, this.clientId, adalCallback);
        this.adalContext.acquireTokenWithClientCredentials(this.resource, this.clientId, this.clientSecret, adalCallback);
        
    }

}