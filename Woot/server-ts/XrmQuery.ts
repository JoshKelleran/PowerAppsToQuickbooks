/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { PowerApp } from './PowerApp';
import { FieldPrefix, Org, Operator, FieldType } from './WootEnums';
import { AsyncResult, Filter, MetadataField, OrderBy } from './WootInterfaces';

export class XrmQuery {

    public static Prefix = 'cr72c_';

    // Retrieve records with filters
    // Field syntax: *[fieldName] = Lookup, $[fieldName] = Picklist, @[fieldName] = Date, Lookup.[fieldName] = Expansion Field
    public static async getRecords(app: PowerApp, entityName: string, properties: string[], filters: Filter[], orderBy: OrderBy[] = [], options: any = {}): Promise<AsyncResult> {
        // eslint-disable-next-line no-unused-vars
        return new Promise((resolve, reject) => {
            XrmQuery._getRecords(app, entityName, properties, filters, orderBy, options, (result: any) => {
                resolve(result); // Always resolve, not -> if (result.error) {reject(result);} else {resolve(result);}
            });
        });
    }
    
    // Retrieve records with filters
    // eslint-disable-next-line no-unused-vars
    private static _getRecords(app: PowerApp, entityName: string, properties: string[], filters: Filter[], orderBy: OrderBy[], options: any, callback: (result: AsyncResult) => void) {
        if (properties == null || properties.length == 0) {
            callback({data: null, error: new Error('Method \'getRecords\' requires a property list.')});
        }

        // Select fields (simple + expansion)
        const simpleProperties = XrmQuery.getSimpleProperties(properties);
        const expansionProperties = XrmQuery.getExpansionProperties(properties);
        
        // Build the filter text
        const filterItems = [];
        // "?$select=cr72c_workerid,cr72c_name&$filter=cr72c_name eq 'Jeff Kelleran'"
        for (let i=0; i < filters.length; i++) {
            const filter: Filter = filters[i];
            const fieldName = XrmQuery.getSystemName(filter.id, filter.noPrefixExpand == true, filter.noPrefixField == true);
            let currFilterText = '';
            if (filter.type == 'string' || filter.type == 'number' || filter.type == 'boolean') {
                const fValue = (filter.type == 'string' && filter.value != null ? '\'' + filter.value + '\'': (filter.value == null ? 'null' : filter.value.toString()));
                currFilterText = fieldName + ' ' + filter.operator + ' ' + fValue;
            }
            else if (filter.type == 'date') {
                const nullDate: Date = new Date(new Date().setTime(0));
                const fValue: Date = (filter.value == null ? nullDate : (filter.value as Date));
                currFilterText = fieldName + ' ' + filter.operator + ' ' + fValue.toISOString();
            }
            else if (filter.type == 'string[]' || filter.type == 'number[]') {
                const fItems = [];
                const values: any[] = filter.value as any[];
                for (let item=0; item < values.length; item++) {
                    const itemValue = (filter.type == 'string[]' ? '\'' + values[item] + '\'' : values[item]);
                    fItems.push(fieldName + ' ' + filter.operator + ' ' + itemValue);
                }
                const joinOperator = (filter.operator == Operator.NotEqual ? ' and ' : ' or ');
                currFilterText = '(' + fItems.join(joinOperator) + ')';
            }
            filterItems.push(currFilterText);
        }
        
        // Build the orderBy
        const orderByItems = [];
        for (let i=0; i < orderBy.length; i++) {
            const currOrderBy = XrmQuery.getSystemName(orderBy[i].id, orderBy[i].noPrefixExpand == true, orderBy[i].noPrefixField == true);
            orderByItems.push(currOrderBy + ' ' + orderBy[i].order);
        }

        // Build the request
        const request: any = {collection: entityName, select: simpleProperties, expand: expansionProperties};
        if (filterItems.length > 0) request.filter = filterItems.join(' and ');
        if (orderByItems.length > 0) request.orderBy = orderByItems;
        for (const property in options) {
            request[property] = options[property];
        }

        // Retrieve the data
        app.api.retrieveMultipleRequest(request).then(
            (XrmResult: any) => {
                
                const result: any = {};
                result.error = null;
                result.data = [];
                for (let i=0; i < XrmResult.value.length; i++) {
                    result.data[i] = XrmQuery.compressObjectProperties(XrmResult.value[i], properties);
                }
                callback(result);
            },
            (XrmError: any) => {
                callback({data: null, error: XrmError});
            }
        );
    }

    // Retrieve a record by an alternate key
    public static async getRecordByKey(app: PowerApp, entityName: string, keyName: string, keyValue: string, properties: string[]): Promise<AsyncResult> {
        // eslint-disable-next-line no-unused-vars
        return new Promise((resolve, reject) => {
            XrmQuery._getRecord(app, entityName, `${XrmQuery.Prefix}${keyName}='${keyValue}'`, properties, (result: any) => {
                resolve(result); // Always resolve, not -> if (result.error) {reject(result);} else {resolve(result);}
            });
        });
    }

    // Retrieve a record
    public static async getRecord(app: PowerApp, entityName: string, guid: string, properties: string[]): Promise<AsyncResult> {
        // eslint-disable-next-line no-unused-vars
        return new Promise((resolve, reject) => {
            XrmQuery._getRecord(app, entityName, guid, properties, (result: any) => {
                resolve(result); // Always resolve, not -> if (result.error) {reject(result);} else {resolve(result);}
            });
        });
    }

    // Retrieve a record
    // eslint-disable-next-line no-unused-vars
    private static _getRecord(app: PowerApp, entityName: string, id: string, properties: string[], callback: (result: AsyncResult) => void) {
        if (properties == null || properties.length == 0) {
            callback({data: null, error: new Error('No property list was supplied for the record retrieval.')});
        }

        const simpleProperties = XrmQuery.getSimpleProperties(properties);
        const expansionProperties = XrmQuery.getExpansionProperties(properties);
        
        app.api.retrieve(id, entityName, simpleProperties, expansionProperties).then(
            (XrmResult: any) => {
                const resultObj = XrmQuery.compressObjectProperties(XrmResult, properties);
                callback({data: resultObj});
            }) 
            .catch((XrmError: any) => {
                callback({data: null, error: XrmError});
            });
    }

    // Create a record
    public static async createRecord(app: PowerApp, entityName: string, data: any): Promise<AsyncResult> {
        // eslint-disable-next-line no-unused-vars
        return new Promise((resolve, reject) => {
            XrmQuery._createRecord(app, entityName, data, (result: any) => {
                resolve(result); // Always resolve, not -> if (result.error) {reject(result);} else {resolve(result);}
            });
        });
    }

    // Create a record
    // eslint-disable-next-line no-unused-vars
    private static _createRecord(app: PowerApp, entityName: string, data: any, callback: (result: AsyncResult) => void) {
        const expandedData = XrmQuery.expandObjectProperties(data);
        app.api.create(expandedData, entityName).then(
            // eslint-disable-next-line no-unused-vars
            (XrmResult: any) => {
                callback({data: XrmResult});
            },
            (XrmError: any) => {
                callback({data: null, error: XrmError});
            }
        );
    }

    // Update a record
    public static updateRecord = async function(app: PowerApp, entityName: string, guid: string, data: any): Promise<AsyncResult> {
        // eslint-disable-next-line no-unused-vars
        return new Promise((resolve, reject) => {
            XrmQuery._updateRecord(app, entityName, guid, data, (result: any) => {
                resolve(result); // Always resolve, not -> if (result.error) {reject(result);} else {resolve(result);}
            });
        });
    }

    // Update a record
    // eslint-disable-next-line no-unused-vars
    private static _updateRecord(app: PowerApp, entityName: string, guid: string, data: any, callback: (result: AsyncResult) => void) {
        const expandedData = XrmQuery.expandObjectProperties(data);
        const request: any = {key: guid, collection: entityName, entity: expandedData};
        app.api.updateRequest(request).then(
            // eslint-disable-next-line no-unused-vars
            (XrmResult: any) => {
                callback({data: true});
            },
            (XrmError: any) => {
                callback({data: null, error: XrmError});
            }
        );
    }

    // Update a record
    public static deleteRecord = async function(app: PowerApp, entityName: string, guid: string): Promise<AsyncResult> {
        // eslint-disable-next-line no-unused-vars
        return new Promise((resolve, reject) => {
            XrmQuery._deleteRecord(app, entityName, guid, (result: any) => {
                resolve(result); // Always resolve, not -> if (result.error) {reject(result);} else {resolve(result);}
            });
        });
    }

    // Update a record
    // eslint-disable-next-line no-unused-vars
    private static _deleteRecord(app: PowerApp, entityName: string, guid: string, callback: (result: AsyncResult) => void) {
        const request: any = {key: guid, collection: entityName};
        app.api.deleteRequest(request).then(
            // eslint-disable-next-line no-unused-vars
            (XrmResult: any) => {
                callback({data: true});
            },
            (XrmError: any) => {
                callback({data: null, error: XrmError});
            }
        );
    }

    private static getSimpleProperties(names: string[]): string[] {
        if (names == null || names.length == 0) throw new Error('List of property names to expand cannot be empty.');
        const propNames:string[] = [];
        for (let i=0; i < names.length; i++) {
            const fieldPrefix = XrmQuery.getFieldPrefix(names[i]);
            const currentName = (fieldPrefix == FieldPrefix.Normal ? names[i] : names[i].substring(1));
            if (currentName.indexOf('.') != -1) continue;
            if (fieldPrefix == FieldPrefix.Lookup) {
                propNames.push(`_${XrmQuery.getFieldName(currentName)}_value`);
            }
            else {
                propNames.push(XrmQuery.getFieldName(currentName));
            }
        }
        return propNames;
    }

    private static getFieldPrefix(fieldName: string): FieldPrefix {
        const firstChar = fieldName.substring(0,1);
        if (firstChar == FieldPrefix.Lookup) return FieldPrefix.Lookup;
        if (firstChar == FieldPrefix.Picklist) return FieldPrefix.Picklist;
        if (firstChar == FieldPrefix.Date) return FieldPrefix.Date;
        return FieldPrefix.Normal;
    }

    private static getExpansionProperties(names: string[]): DynamicsWebApi.Expand[] {

        // Build the expansion fields
        const expansionFields: DynamicsWebApi.Expand[] = [];
        const fieldsMap: any = {};
        for (let i=0; i < names.length; i++) {
            if (names[i].indexOf('.') == -1) continue;
            const fieldPrefix = XrmQuery.getFieldPrefix(names[i]);
            const nameParts = (fieldPrefix == FieldPrefix.Normal ? names[i].split('.') : names[i].substring(1).split('.'));
            nameParts[0] = XrmQuery.getFieldName(nameParts[0]);
            nameParts[1] = XrmQuery.getFieldName(nameParts[1]);
            const currentEntity = fieldsMap[nameParts[0]];
            if (currentEntity == undefined) {
                const expansionField = {property: nameParts[0], select:[nameParts[1]]};
                expansionFields.push(expansionField);
                fieldsMap[nameParts[0]] = expansionField;
            }
            else {
                (currentEntity as DynamicsWebApi.Expand).select?.push(nameParts[1]);
            }
        }
        return expansionFields;
    }

    private static expandObjectProperties(obj: any): any {
        const result: any = {};
        for (const property in obj) {
            const fullName = XrmQuery.getFieldName(property);
            result[fullName] = obj[property];
        }
        return result;
    }

    private static compressObjectProperties(obj: any, names: string[]): any {
        if (obj == null || names == null || names.length == 0) return null;
        const result: any = {};
        const formatSuffix = '@OData.Community.Display.V1.FormattedValue';

        for (let i=0; i < names.length; i++) {
            const fieldPrefix = XrmQuery.getFieldPrefix(names[i]);
            const currentName = (fieldPrefix == FieldPrefix.Normal ? names[i] : names[i].substring(1));
            const propertyName = (currentName.substring(0,2) == 'np' ? currentName.substring(3) : currentName);

            // Compound property
            if (currentName.indexOf('.') != -1) {
                const nameParts = currentName.split('.');
                const entityName = (nameParts[0].substring(0,2) == 'np' ? nameParts[0].substring(3) : nameParts[0]);
                const propName = (nameParts[1].substring(0,2) == 'np' ? nameParts[1].substring(3) : nameParts[1]);
                if (result[entityName] == undefined) result[entityName] = {};
                const retrieveEntityName = XrmQuery.getFieldName(entityName);
                const retrievePropertyName = XrmQuery.getFieldName(propName);
                if (obj[retrieveEntityName][retrievePropertyName + formatSuffix] == undefined) {
                    result[entityName][propName] = (fieldPrefix == FieldPrefix.Date ? new Date(obj[retrieveEntityName][retrievePropertyName]) : obj[retrieveEntityName][retrievePropertyName]);
                }
                else {
                    result[entityName][propName] = {};
                    result[entityName][propName].id = obj[retrieveEntityName][retrievePropertyName];
                    result[entityName][propName].name = obj[retrieveEntityName][retrievePropertyName + formatSuffix];
                }
            }

            // Lookup
            else if (fieldPrefix == FieldPrefix.Lookup) {
                const retrieveName = `_${XrmQuery.getFieldName(currentName)}_value`;
                result[propertyName] = {};
                result[propertyName].id = obj[retrieveName];
                result[propertyName].name = obj[retrieveName + formatSuffix];
            }

            // Picklist / Formatted Value
            else if (fieldPrefix == FieldPrefix.Picklist) {
                const retrieveName = XrmQuery.getFieldName(currentName);
                result[propertyName] = {};
                result[propertyName].id = obj[retrieveName];
                result[propertyName].name = obj[retrieveName + formatSuffix];
            }
            
            // Simple property (number, string, date)
            else {
                const retrieveName = XrmQuery.getFieldName(currentName);
                result[propertyName] = (fieldPrefix == FieldPrefix.Date ? new Date(obj[retrieveName]) : obj[retrieveName]);
            }

        }
        return result;
    }

    private static getSystemName(field: string, noPrefixExpand: boolean, noPrefixField: boolean): string {
        const prefix = Org.Prefix;
        if (field.indexOf('.') == -1) {
            return (noPrefixField ? field : prefix + field);
        }
        else {
            const nameParts = field.split('.');
            const fullEntity = (noPrefixExpand ? nameParts[0] : prefix + nameParts[0]);
            const fullField = (noPrefixField ? nameParts[1] : prefix + nameParts[1]);
            return `${fullEntity}/${fullField}`;
        }
    }

    private static getFieldName(name: string): string {
        // NOTE: Either np: or np_ will work (np_ is a necessity for property names in javascript)
        return (name.substring(0,2) == 'np' ? name.substring(3) : XrmQuery.Prefix + name);
    }

    public static getSelectFields(metadataFields: MetadataField[]): string[] {
        const fields: string[] = [];
        for (const metadataField of metadataFields) {
            const prefix = (metadataField.fieldType == FieldType.Lookup ? '*' : (metadataField.fieldType == FieldType.Date ? '@' : '')) + (metadataField.noPrefixField ? 'np_' : '');
            fields.push(prefix + metadataField.id);
        }
        return fields;
    }

}