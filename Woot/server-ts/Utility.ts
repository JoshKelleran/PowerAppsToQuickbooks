// NOTE: Keep PowerApp/Node version of this file synchronized
// eslint-disable-next-line no-unused-vars
import { WorkerModel, WorkerInfo, AsyncResult, NameValuePair } from './WootInterfaces';

export class Utility {
    
    public static Prefix = 'cr72c_';
    public static PicklistBase = 290640000;

    public static getUrlParameter(location: string, parameterName: string): string | null {

        // Get the raw query string (minus the '?')
        if (location.search == null) return null;
        let decodedQS = decodeURI(location.substring(1));
        decodedQS = decodedQS.replace(/%3a/g, ':');
        decodedQS = decodedQS.replace(/%2c/g, ',');
        const rawParameters = decodedQS.split('&');
        
        // Split out the parameters
        const parameters: string[][] = [];
        for (const i in rawParameters) {
            parameters[i] = rawParameters[i].split('='); 
        }
    
        // Find the named parameter
        let value = null;
        for (const i in parameters) {
            if (parameters[i][0].toLowerCase() == parameterName) {
                value = parameters[i][1];
                break;
            }
        }
    
        // Return null if parameter wasn't found
        if (value == null) {
            return null;
        }
        
        // Return an object if it is JSON
        else if (value.substring(0,1) == '{') {
            return JSON.parse(value);
        }
    
        // Otherwise just the simple value
        else {
            return value;
        }
    
    }

    public static sleep(ms: number): Promise<any> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    public static addDays(value: Date, daysToAdd: number): Date {
        return new Date(value.getTime() + (daysToAdd * 24 * 60 * 60 * 1000));
    }

    public static getDaysOffset(date1: Date, date2: Date, wholeDays = true): number {
        const d1 = new Date(date1);
        const d2 = new Date(date2);
        if (wholeDays) {
            d1.setHours(0,0,0,0);
            d2.setHours(0,0,0,0);
        }
        return (d1.getTime() - d2.getTime()) / (24*60*60*1000);
    }

    public static getMilliseconds(start: Date, finish: Date): number {
        return finish.getTime() - start.getTime();
    }

    public static now(dateOnly = false): Date {
        const date = new Date();
        if (dateOnly) date.setHours(0,0,0,0);
        return date;
    }

    public static getDateOnly(date: Date): Date {
        const d = new Date(date);
        d.setHours(0,0,0,0);
        return d;
    }

    public static getTime(date: Date, addDays = 0, hours = 0, minutes = 0, seconds = 0, millis = 0): Date {
        const d = (addDays == 0 ? new Date(date) : Utility.addDays(date, addDays));
        d.setHours(hours, minutes, seconds, millis);
        return d;
    }

    public static getFormattedDate(value: Date, includeTime = false, includeSeconds = false, timeOnly = false): string {
        if (value === undefined || value == null) return '--';
        const date = new Date(value);
        const day = date.getDate().toString();
        const month = (date.getMonth() + 1).toString();
        const year = (date.getFullYear()).toString().substr(-2);
        const formattedDay = `${month}/${day}/${year}`;
        if (includeTime == null || includeTime == false){
            return formattedDay; 
        }
        else {
            let hour = date.getHours();
            const partOfDay = (hour >= 12 ? ' PM' : ' AM');
            if (hour > 12) hour = hour - 12;
            if (hour == 0) hour = 12;
            const formattedHour = hour.toString();
            const minutes = date.getMinutes();
            const formattedMinutes = ':' + (minutes < 10 ? '0' : '') + minutes.toString(); 
            const seconds = date.getSeconds();
            const formattedSeconds = (!includeSeconds ? '' : ':' + (seconds < 10 ? '0' : '') + seconds.toString());
            const formattedTime = formattedHour + formattedMinutes + formattedSeconds + partOfDay ;
            return (timeOnly ? formattedTime : formattedDay + ' ' + formattedTime);
        }
        
    }

    public static getFormattedNumber(value: number): string {
        if (value == null) return '--';
        const formatter = Intl.NumberFormat();
        return formatter.format(value);
    }

    public static getDateDifference(start: Date, end: Date, format: 'milliseconds' | 'seconds' | 'minutes' | 'hours' | 'days' = 'days'): number {
        const millis = end.getTime() - start.getTime();
        if (format == 'milliseconds') return millis;
        if (format == 'seconds') return Utility.round(millis/1000, 1);
        if (format == 'minutes') return Utility.round(millis/(1000*60), 1);
        if (format == 'hours') return Utility.round(millis/(1000*60*60), 1);
        else return Utility.round(millis/(1000*60*60*24), 1);
    }

    public static round(value: number, precision = 0): number {
        if (value == null || isNaN(value)) return 0;
        const multiplier = Math.pow(10, precision);
        return Math.round(value * multiplier) / multiplier;
    }

    public static getCurrency(value: number) : string {
        const formatter = new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'});
        return formatter.format(value);
    }

    public static isAlphaNumeric(value: string): boolean {
        for (let i = 0, len = value.length; i < len; i++) {
            const code = value.charCodeAt(i);
            if (!(code > 47 && code < 58) && // numeric (0-9)
              !(code > 64 && code < 91) && // upper alpha (A-Z)
              !(code > 96 && code < 123)) { // lower alpha (a-z)
                return false;
            }
        }
        return true;
    }

    public static isSameId(id1: string, id2: string): boolean | null {
        if (!id1 || !id2) return null;
        return (id1.toLowerCase() == id2.toLowerCase());
    }

    public static isEmptyDate(date: any): boolean {
        if (date == null || date == undefined || date.getTime == undefined) return true;
        return date.getTime() == 0;
    }

    public static isEmptyValue(value: any): boolean {
        return (value === null || value === '' || (typeof value == 'object' && 'id' in value && (value.id === null || value.id === '')));
    }

    public static removeEmptyValues(item: any): any {
        if (typeof item != 'object') return item;
        const obj: any = {};
        for (const key in item) {
            const value = item[key];
            if (!Utility.isEmptyValue(value)) {
                obj[key] = item[key];
            }
        }
        return obj;
    }

    public static copyFields(obj: any, fields: string[]) {
        if (obj == null || typeof obj != 'object') return null;
        const result: any = {};
        for (const field of fields) {
            result[field] = obj[field];
        }
        return result;
    }

    public static setFields(obj: any, fields: string[], value: number | string | null): void {
        if (obj == null || typeof obj != 'object') return;
        for (const field of fields) {
            obj[field] = value;
        }
    }

    public static getWorker(workerId: string, model: WorkerModel | null): WorkerInfo | null {
        if (model == null || workerId == null || workerId == '') return null;
        const worker = model.workers[workerId];
        return (worker == undefined ? null : worker);
    }

    public static getWorkerFromUser(userId: string, model: WorkerModel | null): WorkerInfo | null {
        if (model == null || userId == null || userId == '') return null;
        const user = model.users[userId];
        if (user == null) return null;
        const worker = model.workers[user.workerId];
        return (worker == undefined ? null : worker);
    }

    public static getWeekday(date: Date): number {
        const day = date.getDay();
        return (day == 0 ? 7 : day);
    }

    public static copyObject(obj: any, exclude?: string[]): any {
        const copy: any = {};
        const excludeObj: any = {};
        if (exclude) {
            for (const name of exclude) {
                excludeObj[name] = true;
            }
        }
        for (const prop in obj) {
            if (excludeObj[prop] == undefined) copy[prop] = obj[prop];
        }
        return copy;
    }

    public static getSnapshotDiff(snapshotObj: any, changeObj: any): any {
        const diffObj: any = {};
        let diff = false;
        for (const prop in snapshotObj) {
            if (snapshotObj[prop] != changeObj[prop]) {
                diffObj[prop] = changeObj[prop];
                diff = true;
            }
        }
        return (!diff ? null : diffObj);
    }
    
    // NOTE: Keep PowerApp/Node version of this file synchronized

}