import OAuthClient from 'intuit-oauth';
import { PowerApp } from './PowerApp';
import { BillType, Operator, OrderStatus, OrderType, StateCode } from './WootEnums';
import { AsyncResult, Filter, MetadataField, Order, OrderCopy } from './WootInterfaces';
import { XrmQuery } from './XrmQuery';
interface CustomerPA {customerid: string, qbcustomerid: string, name: string, address: string, address2: string, city: string, state: string, zip: string, country: string, contactname: string, contactemail: string, contactphone: string}
interface CustomerQB {GivenName: string, BillAddr: {CountrySubDivisionCode: string, Line1: string, Line2: string, City: string, PostalCode: string, Country: string}, PrimaryEmailAddr: {Address: string}, CompanyName: string}

export class QuickbooksSync {
    private oAuthClient: OAuthClient;
    private baseUrl: string;
    public app: PowerApp;
    
    constructor(oAuthClient: OAuthClient, baseUrl: string, app: PowerApp) {
        this.oAuthClient = oAuthClient;
        this.baseUrl = baseUrl;
        this.app = app;
    }

    public async sync(): Promise<any> {return new Promise((resolve, reject) => {this._sync((result: any) => {if (!result.error) {resolve(result.data);} else {reject(result.error);}});});}
    private async _sync(callback: any) {
        // Result object
        const result: AsyncResult = {data: null};
        try {
            // Ensure we have a valid connection to Quickbooks and the Power app
            if (!this.oAuthClient) {result.data = 'No valid connection to quickbooks.'; callback(result); return;}
            if (!this.app) {result.data = 'No valid connection to PowerApp.'; callback(result); return;}

            const resultOrders = await this.getOpenOrders();
            // const resultCustomers = await this.getCustomersQB();

            const qbResponses: any[] = [];

            for (const order of resultOrders) {
                const customerPA = await this.getCustomerPA(order.billto.id);
                if (customerPA.qbcustomerid == null) {

                    // Create QB customer
                    const customerBody: CustomerQB = {GivenName: customerPA.name, 
                        BillAddr: {CountrySubDivisionCode: customerPA.state, Line1: customerPA.address, Line2: (customerPA.address2 == null ? '' : customerPA.address2), City: customerPA.city, PostalCode: customerPA.zip, Country: customerPA.country},
                        PrimaryEmailAddr: {Address: customerPA.contactemail},
                        CompanyName: customerPA.name
                    };
                    const customerQB = await this.postQuickbooksData(`${this.baseUrl}v3/company/${this.getCompanyId()}/customer`, customerBody);
                    qbResponses.push(customerQB);

                    // Update the PowerApp record with the QB customer id
                    const updateData = {qbcustomerid: customerQB.Customer.Id};
                    const updateResult = await XrmQuery.updateRecord(this.app, XrmQuery.Prefix + 'customer', customerPA.customerid, updateData);
                    if (updateResult.error) throw updateResult.error;

                }
                else {
                    // Call QB and look up details
                    const customerQB = await this.getQuickbooksData(`${this.baseUrl}v3/company/${this.getCompanyId()}/customer/${customerPA.qbcustomerid}`);
                    qbResponses.push(customerQB);

                    // Compare the PowerApp / QB customer records. Update QB if it is different
                    if (this.getCustomerChanged(customerPA, customerQB)) {
                        // Update QB
                    }

                }
                // Get QB data for customerPA.qbcustomerid
                // TODO: set result.data and callback(result) xx
            // for each order do something
            // get singular customer from power app
            // if no quickbooks id 
            // then create new qb customer and update power app with new idea
            // else 
            // look up qb customer details (singular)
            // if different -> update qb customer (power apps is master)
            // look at invoice number on the order (power apps) e.x T1088 -> becomes N1088 in qb docnumber (DocNumber = 'N1088')
            // if none exist (in powerapps) create an invoice in quickbooks
            // if the amount is different -> update the amount
            // update the status of the order to invoiced
            }
            const returnValue = {
                succeeded: true,
                responses: qbResponses
            };
            result.data = returnValue;
            callback(result);

        }
        catch(e) {
            result.error = e;
            callback(result);
        }
  
    }

    private getCustomerChanged(customerPA: CustomerPA, customerQB: CustomerQB): boolean {
        // Return customerPA props != customerQB props
        return true;
    }

    public async postQuickbooksData(url:string, body: any): Promise<any> {return new Promise((resolve, reject) => {this._postQuickbooksData(url, body, (result: any) => {if (!result.error) {resolve(result.data);} else {reject(result.error);}});});}
    private async _postQuickbooksData(url: string, body: any, callback: any) {
        // Result object
        const result: AsyncResult = {data: null};
        try {
            // Ensure we have a valid connection to Quickbooks
            if (!this.oAuthClient) {result.data = 'No valid connection to quickbooks.'; callback(result); return;}
            
            // Call the API
            this.oAuthClient
                .makeApiCall({
                    url: url,
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(body)
                })
                .then(function (authResponse: any) {
                    // console.log(`The response for API call is :${JSON.stringify(authResponse)}`);
                    result.data = JSON.parse(authResponse.text());
                    callback(result);
                })
                .catch(function (e: any) {
                    result.error = e;
                    callback(result);
                });
        }
        catch(e) {
            result.error = e;
            callback(result);
        }
  
    }

    public async getQuickbooksData(url:string): Promise<any> {return new Promise((resolve, reject) => {this._getQuickbooksData(url, (result: any) => {if (!result.error) {resolve(result.data);} else {reject(result.error);}});});}
    private async _getQuickbooksData(url: string, callback: any) {
        // Result object
        const result: AsyncResult = {data: null};
        try {
            // Ensure we have a valid connection to Quickbooks
            if (!this.oAuthClient) {result.data = 'No valid connection to quickbooks.'; callback(result); return;}
            
            // Call the API
            this.oAuthClient
                .makeApiCall({ url: url })
                .then(function (authResponse: any) {
                    result.data = JSON.parse(authResponse.text());
                    callback(result);
                })
                .catch(function (e: Error) {
                    result.error = e;
                    callback(result);
                });
        }
        catch(e) {
            result.error = e;
            callback(result);
        }
  
    }

    public async getCustomersQB(): Promise<any> {return new Promise((resolve, reject) => {this._getCustomersQB((result: any) => {if (!result.error) {resolve(result.data);} else {reject(result.error);}});});}
    private async _getCustomersQB(callback: any) {
        // Result object
        const result: AsyncResult = {data: null};
        try {
            // Ensure we have a valid connection to Quickbooks
            if (!this.oAuthClient) {result.data = 'No valid connection to quickbooks.'; callback(result); return;}
            
            // Call the API
            this.oAuthClient
                .makeApiCall({ url: `${this.baseUrl}v3/company/${this.getCompanyId()}/query?query=select * from Customer Where Metadata.LastUpdatedTime > '2015-03-01'` })
                .then(function (authResponse: any) {
                    result.data = JSON.parse(authResponse.text());
                    callback(result);
                })
                .catch(function (e: Error) {
                    result.error = e;
                    callback(result);
                });
        }
        catch(e) {
            result.error = e;
            callback(result);
        }
  
    }

    private getCompanyId(): string {
        if (!this.oAuthClient) return '';
        return this.oAuthClient.getToken().realmId;
    }

    public async getOpenOrders(): Promise<OrderCopy[]> {return new Promise((resolve, reject) => {this._getOpenOrders((result: AsyncResult) => {if (!result.error) {resolve(result.data);} else {reject(result.error);}});});}
    // eslint-disable-next-line no-unused-vars
    private async _getOpenOrders(callback: (result: AsyncResult) => void) {
        const result: AsyncResult = {data: null};
        try {

            // Build the list of fields
            const fields: MetadataField[] = [];
            for (const key in Order.Info) {
                const field = (Order.Info as any)[key];
                if (field.copy)  fields.push(field);
            }

            // Get the open orders
            const filters: Filter[] = [
                {id: 'ordertype', operator: Operator.Equal, type: 'number', value: OrderType.Order},
                {id: 'statuscode', operator: Operator.Equal, type: 'number', value: OrderStatus.RateFinal, noPrefixField: true},
                {id: 'billtype', operator: Operator.NotEqual, type: 'number', value: BillType.NonBillable},
                {id: 'statecode', operator: Operator.Equal, type: 'number', value: StateCode.Active, noPrefixField: true}
            ];
            const orders = await XrmQuery.getRecords(this.app, XrmQuery.Prefix + 'order', XrmQuery.getSelectFields(fields), filters);
            if (orders.error) throw orders.error;

            // Success
            result.data = orders.data as OrderCopy[];
            callback(result);
        }

        catch(e) {
            result.error = e;
            callback(result);
        }
    }

    public async getCustomerPA(customerId: string): Promise<CustomerPA> {return new Promise((resolve, reject) => {this._getCustomerPA(customerId, (result: AsyncResult) => {if (!result.error) {resolve(result.data);} else {reject(result.error);}});});}
    // eslint-disable-next-line no-unused-vars
    private async _getCustomerPA(customerId: string, callback: (result: AsyncResult) => void) {
        const result: AsyncResult = {data: null};
        try {

            // Get the customer
            const fields = ['customerid', 'qbcustomerid', 'name', 'address', 'address2', 'city', 'state', 'zip', 'country', 'contactname', 'contactemail', 'contactphone'];
            const customer = await XrmQuery.getRecord(this.app, XrmQuery.Prefix + 'customer', customerId, fields);
            if (customer.error) throw customer.error;

            // Success
            result.data = customer.data as CustomerPA;
            callback(result);
        }

        catch(e) {
            result.error = e;
            callback(result);
        }
    }


}