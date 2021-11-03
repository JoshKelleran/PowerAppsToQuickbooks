import { PowerApp } from './PowerApp';
import { Operator, SystemGuids, StateCode } from './WootEnums';
import { AsyncResult, Filter, OrderBy, WorkerData, WorkerModel } from './WootInterfaces';
import { XrmQuery } from './XrmQuery';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RuntimeConfiguration = {configurationid:string,name:string,value:any,execute:boolean}

export class Configuration {
    // public static Info: {[key in ConfigurationMember]: MetadataField} = {'configurationid':{id:'configurationid',type:'string',fieldType:FieldType.Simple,readOnly:true},'name':{id:'name',type:'string',fieldType:FieldType.Simple},'value':{id:'value',type:'json',fieldType:FieldType.Json}}    

    // Retrieve one or multiple configuration items
    public static async getItem(app: PowerApp, name: string, executeOnly = false): Promise<RuntimeConfiguration> {return new Promise((resolve, reject) => {this._getItems(app, [name], executeOnly, (result: AsyncResult) => {if (!result.error) {resolve(result.data[0]);}else {reject(result.error);}});});}
    public static async getItems(app: PowerApp, names: string[], executeOnly = false): Promise<RuntimeConfiguration[]> {return new Promise((resolve, reject) => {this._getItems(app, names, executeOnly, (result: AsyncResult) => {if (!result.error) {resolve(result.data);} else {reject(result.error);}});});}
    // eslint-disable-next-line no-unused-vars
    private static async _getItems(app: PowerApp, names: string[], executeOnly: boolean, callback: (result: AsyncResult) => void) {
        const result: AsyncResult = {data: null};
        try {
            // Get the requested config data
            const select = ['configurationid', 'name', 'value', 'execute'];
            const filters: Filter[] = [{id: 'name', operator: Operator.Equal, type: 'string[]', value: names}];
            if (executeOnly) filters.push({id: 'execute', operator: Operator.Equal, type: 'boolean', value: executeOnly});
            const configResult = await XrmQuery.getRecords(app, XrmQuery.Prefix + 'configuration', select, filters);
            if (configResult.error) throw configResult.error;
            const configs = configResult.data as RuntimeConfiguration[];

            // Set the results
            const data: RuntimeConfiguration[] = [];
            for (let i=0; i < names.length; i++) {
                for (const config of configs) {
                    if (names[i] == config.name) {
                        data[i] = config;
                        config.value = JSON.parse(config.value);
                        break;
                    }
                }
                if (data[i] == undefined) data[i] = {configurationid: '', name: '', value: null, execute: false};
            }

            // Success
            result.data = data;
            callback(result);
        }
    
        catch(e) {
            result.error = e;
            callback(result);
        }
    }

    public static async setItem(app: PowerApp, configItem: RuntimeConfiguration): Promise<boolean> {return new Promise((resolve, reject) => {this._setItem(app, configItem, (result: AsyncResult) => {if (!result.error) {resolve(result.data);} else {reject(result.error);}});});}
    // eslint-disable-next-line no-unused-vars        
    private static async _setItem(app: PowerApp, configItem: RuntimeConfiguration, callback: (result: AsyncResult) => void) {
        const result: AsyncResult = {data: null};
        try {
            if (configItem.configurationid == '') {
                const valueObj = {name: configItem.name, value: JSON.stringify(configItem.value), execute: configItem.execute};
                const create = await XrmQuery.createRecord(app, XrmQuery.Prefix + 'configuration', valueObj);
                if (create.error) throw new Error(`Failed to create configuration item '${configItem.name}'. ${create.error.message}`);
                configItem.configurationid = create.data.id;
            }
            else {
                const valueObj = {name: configItem.name, value: JSON.stringify(configItem.value), execute: configItem.execute};
                const update = await XrmQuery.updateRecord(app, XrmQuery.Prefix + 'configuration', configItem.configurationid, valueObj);
                if (update.error) throw new Error(`Failed to update configuration item '${configItem.name}'. ${update.error.message}`);
            }

            // Success
            result.data = true;
            callback(result);
        }
    
        catch(e) {
            result.error = e;
            callback(result);
        }
    }

    public static async getWorkerConfig(app: PowerApp): Promise<WorkerModel> {return new Promise((resolve, reject) => {Configuration._getWorkerConfig(app, (result: AsyncResult) => {if (!result.error) {resolve(result.data);} else {reject(result.error);}});});}

    // eslint-disable-next-line no-unused-vars
    private static async _getWorkerConfig(app: PowerApp, callback: (result: AsyncResult) => void) {
        const result: AsyncResult = {data: null};
        try {
            // Get the worker data
            const select = ['workerid', 'name', 'employee', 'hourlyrate', 'monthlysalary', 'revenuepct', '*user', 'workertype'];
            const filters: Filter[] = [{id: 'statecode', operator: Operator.Equal, type: 'number', value: StateCode.Active, noPrefixField: true}];
            const order: OrderBy[] = [{id: 'name', order: 'asc'}];
            const result = await XrmQuery.getRecords(app, XrmQuery.Prefix + 'worker', select, filters, order);
            if (result.error) throw result.error;
            const workers = result.data as WorkerData[];
            const wm: WorkerModel = {workers: {}, users: {}};
            for (const worker of workers) {
                const userId = (worker.user.id == null || worker.user.id == '' ? null : worker.user.id);
                wm.workers[worker.workerid] = {name: worker.name, employee: worker.employee, hourlyRate: worker.hourlyrate, monthlySalary:worker.monthlysalary, revenuePct: worker.revenuepct, workerType: worker.workertype, userId: userId};
                if (userId != null) wm.users[userId] = {workerId: worker.workerid};
            }

            // Update the configuration record
            const data = {value: JSON.stringify(wm)};
            const update = await XrmQuery.updateRecord(app, XrmQuery.Prefix + 'configuration', SystemGuids.WorkerConfig, data);
            if (update.error) throw new Error(`Failed to update worker configuration data. ${update.error.message}`);

            // Success
            result.data = wm;
            callback(result);
        }

        catch(e) {
            result.error = e;
            callback(result);
        }
    }

}