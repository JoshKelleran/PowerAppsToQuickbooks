/* eslint-disable no-unused-vars */
declare module 'intuit-oauth' {
    
    /*
    export class Response<T extends object = object> {
        getJson(): T;
    }
    */

    export interface qbApiObject {
        url: string;
        method?: string;
        headers?: any;
        body?: any;
    }

    export = class OAuthClient {
        static environment: {
            sandbox: string;
            production: string;
        }
        environment: string;

        constructor(options: any);
        authorizeUri({ scope: any, state: string}): string;
        createToken(uri: string): Promise<{ token: OAuthClientSecret }>;
        getToken(): { realmId: string };
        makeApiCall(qbApiObject);
        // refreshUsingToken(token: string): Promise<Response<OAuthClientSecret>>;
    }

    export = class OAuthClientSecret {
        realmId: string;
        access_token: string;
        expires_in: number;
        refresh_token: string;
        x_refresh_token_expires_in: number;
    }

}