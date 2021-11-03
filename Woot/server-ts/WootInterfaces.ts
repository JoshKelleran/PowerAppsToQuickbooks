/* eslint-disable no-unused-vars */
import { Operator, TrackStatus, LegType, StateCode, WorkerType, OrderType, RatingType, BillType, LoadType, OrderStatus, LegPayType, FuelType, BucketType, LegStatus } from './WootEnums';
import { Utility } from './Utility';
import { FieldType } from './WootEnums';

export interface Fleet {
    vehicles: Vehicle[];
    mapEroad: Map <string, Vehicle>;
    mapUnit: Map <string, Vehicle>;
}

export interface Vehicle {
    eroadId: string;
    unit: string;
    odometer: number;
    ignition: string;
    gpsLatitude: number;
    gpsLongitude: number;
    gpsTime: Date;
    direction: string;
    speedMph: number;
    distanceReading: number;
    engineHours: number;
    readableLocation: string;
    driverId: string;
    statusCurrent: boolean;
}

export interface VehicleUpdate {
    eroadstatus: string;
    eroadgpslatitude: number;
    eroadgpslongitude: number;
    eroadgpstime: Date;
    eroaddirection: string;
    eroadspeedmph: number;
    eroaddistancereading: number;
    eroadenginehours: number;
    eroadreadablelocation: string;
    miles: number;
    milesdate: Date;
    milestext: string;
}

export interface VehicleStatus {
    id: string;
    status: string;
    gpsFix: {
        timestamp: string;
        coordinate: {
            latitude: number;
            longitude: number;
        }
        courseOverGround: number;
        speedKph: number;
    },
    distanceReading: number;
    odometer: number;
    engineHours: number;
    readableLocation: string;
    currentDriverId: string;
}

export interface Filter {
    id: string;
    type: 'string' | 'number' | 'string[]' | 'number[]' | 'boolean' | 'date';
    operator: Operator;
    value: string | number | Date | string[] | number[] | boolean | null;
    noPrefixExpand?: boolean;
    noPrefixField?: boolean;
}

export interface OrderBy {
    id: string;
    order: 'asc' | 'desc';
    noPrefixExpand?: boolean;
    noPrefixField?: boolean;
}

export interface AsyncResult {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any;
    error?: Error;
}

export interface FormattedValue {
    id: unknown;
    name: string;
}

export interface Address {
    value: string;
    text: string;
    address: string;
    address2: string;
    city: string;
    state: string;
    zip: string;
}

export interface TrackedOrder {
    orderid: string;
    name: string;
    loadnumber: string;
    trackerrors: number;
    trackstatus: TrackStatus;
    legs: TrackedLeg[];
    requiresUpdate: boolean;
    errorsFourKites: Error[];
    errorsPowerApp: Error[];
}

export interface TrackedLeg {
    legid: string;
    ownerid: string;
    name: string;
    datestartoffset: number;
    origin: Address;
    destination: Address;
    order: FormattedValue;
    type: LegType;
    sequence: number;
    timestartestimated: Date;
    timestartactual: Date;
    drivetimeminutes: number;
    timedrivepadding: number;
    timewaitestimated: number;
    timearrivalestimated: Date;
    timearrivalactual: Date;
    timedepartureestimated: Date;
    timedepartureactual: Date;
    trackstarted: boolean;
    trackarrived: boolean;
    trackdeparted: boolean;
    geofenceorigin: string;
    geofencedestination: string;
    requiresUpdate: boolean;
    tracking: LegTracking;
}

export interface ApiResponse {
    status: number;
    message: string;
}

export interface FourKitesSummary {
    orderCount: number;
    legCount: number;
    legDetails: string[];
    errorsFourKites: Error[];
    errorsPowerApp: Error[];
}

export interface LegTracking {
    updateStarted: boolean;
    updateArrived: boolean;
    updateDeparted: boolean;
    apiResponseStarted: ApiResponse;
    apiResponseArrived: ApiResponse;
    apiResponseDeparted: ApiResponse;
}

export interface Geofence {
    id: string;
    key: string;
    name: string;
    customerId: string;
    customerName: string;
    customerKey: string;
    radius: number;
    custom: boolean;
    latitude: number;
    longitude: number;
    updatePowerApp: boolean;
    apiResponseEroad: ApiResponse;
    apiResponsePowerApp: ApiResponse;
}

export interface EroadGeofenceCreate {
    name: string;
    latitude: number;
    longitude: number;
    size: number;
    types: string[];
}

export interface EroadGeofenceUpdate {
    name: string;
    types: string[];
    shape: string;
}

export interface EroadGeofenceResponse {
    id: string;
    name: string;
    types: string[];
    shape: string;
    warning?: string;
}

export interface PowerAppGeofence {
    customerid: string;
    name: string;
    key: string;
    latitude: number;
    longitude: number;
    geofenceid: string;
    geofencecustom: boolean;
    geofenceradius: number;
}

export interface GeofenceSyncResult {
    created: number;
    createFailed: number;
    updated: number;
    updateFailed: number;
}

export interface NameValuePair {
    name: string;
    value: any;
}

export type Lookup = {id: string; name: string; entityType: string;}
export type WorkerData = {workerid:string;name:string;employee:boolean;hourlyrate:number;monthlysalary:number;revenuepct:number;user:Lookup;workertype:WorkerType;statecode:StateCode}
export type WorkerMember = keyof WorkerData;
export type WorkerInfo = {name: string; employee: boolean; userId: string | null; hourlyRate: number; monthlySalary: number; revenuePct: number; workerType: WorkerType;}
export type WorkerModel = {workers: {[key: string]: WorkerInfo;}, users: {[key: string]: {workerId: string;}}}
export type RecordType = 'customer' | 'counter' | 'equipment' | 'maintenanceitem' | 'order' | 'leg' | 'fuelrate' | 'worker' | 'configuration' | 'payroll' | 'payrollitem';
export type PicklistType = 'BillType' | 'FuelType' | 'LoadType' | 'OrderType' | 'RateType' | 'RatingType' | 'StateCode' | 'OrderStatus' | 'TrackStatus' | 'ServicingType' | 'RepairType' | 'MaintenanceReportType' | 'ServiceType' | 'MaintenanceStatus' | 'LocationType' | 'EquipmentType' | 'LegType' | 'LegStatus' | 'InvoiceStatus' | 'WorkerType' | 'LegPayType' | 'BucketType' | 'PayrollStatus' | 'PayrollItemStatus' | 'PayType' | 'EntryType';
export type FieldDataType = RecordType | PicklistType | 'number' | 'string' | 'Date' | 'picklist' | 'boolean' | 'json' | 'worker' | 'team' | 'route' | 'systemuser' | 'team';
export type Metadata = {[key: string]: MetadataField}
export type MetadataField = {id: string; type: FieldDataType; fieldType: FieldType; expandField?: string; noPrefixField?: boolean; nullable?: boolean; noFormLock?: boolean; gridLock?: boolean; readOnly?: boolean; init?: any; copy?: boolean; calc?: boolean;}

// Maintained in PowerAppFields.xlsx
export type OrderData = {accessorial:number;accessorialdiscount:number;additionalcontactname:string;additionalcontactemail:string;additionalcontactphone:string;billto:Lookup;billtotext:string;billtype:BillType;consignee:Lookup;detention:number;fuel:number;fuelfixedmiles:boolean;fuelfixedmilesamount:number;fuelfixedpct:number;fuelflat:number;fuelpermile:number;fuelsurchargepct:number;fueltype:FuelType;invoice:string;linehaulbase:number;linehauldiscount:number;linehauldiscountpct:number;linehauldiscounttoggle:boolean;linehaulgross:number;linehaulnet:number;loadcomment:string;loadcommodity:string;loadexpedited:boolean;loadhazardous:boolean;loadlength:number;loadnumber:string;loadreefer:boolean;loadtautliner:boolean;loadtype:LoadType;loadweight:number;milesempty:number;milesloaded:number;milesrated:number;milestotal:number;name:string;namelong:string;legacytag:string;orderdate:Date;orderid:string;ordertype:OrderType;otherrevenue:number;profit:number;profitpertotalmile:number;quote:Lookup;ratingadjustment:number;ratingbucket:BucketType;ratingcomment:string;ratingtype:RatingType;ratingsummary:string;readonly:boolean;revenuebeforefuel:number;revenuedate:Date;revenueexcludeadjust:number;revenueincludefuel:number;revenueperloadedmile:number;revenuepertotalmile:number;revenuetotal:number;shipper:Lookup;statecode:StateCode;statuscode:OrderStatus;trackcompleted:boolean;trackerrors:number;trackload:boolean;trackstatus:TrackStatus;upliftcanada:number;upliftexpedited:number;uplifthazardous:number;upliftreefer:number;uplifttautliner:number}
export type OrderMember = keyof OrderData;
export type OrderCopyExclude = 'billtotext'|'invoice'|'otherrevenue'|'quote'|'ratingsummary'|'revenuedate'|'statecode'|'statuscode'|'trackcompleted'|'trackerrors'|'trackload'|'trackstatus';
export type OrderCopy = Omit<OrderData, OrderCopyExclude>;
export type OrderCopyMember = keyof OrderCopy
export type OrderCopyOverride = {detention:number,loadcomment:string,loadnumber:string,name:string,namelong:string,legacytag:string,orderdate:Date,orderid:string,ordertype:OrderType,ratingadjustment:number,ratingtype:RatingType,readonly:boolean}
export type LegData = {appointmentcomment:string;appointmentearliest:Date;appointmentlatest:Date;comment:string;datestart:Date;datestartoffset:number;description:string;descriptionlong:string;descriptionshort:string;destination:Lookup;destinationcity:string;destinationcountry:string;destinationstate:string;driverallocationpct:number;driverallocationrev:number;drivercostfixed:number;drivercostburdened:number;drivercostpayroll:number;driverhours:number;driverhoursbreak:number;driverhoursreg:number;driverhoursot:number;driverhourlyratereg:number;driverhourlyrateot:number;driverhourlyrateoverride:number;driverrevenuepct:number;driverrevenue:number;drivetime:string;drivetimeminutes:number;equipmentdolly:Lookup;equipmenttractor:Lookup;equipmenttrailer1:Lookup;equipmenttrailer2:Lookup;geofencedestination:string;geofenceorigin:string;legid:string;lineup:string;mapview:string;milesadditional:number;milesroute:number;milestotal:string;name:string;order:Lookup;ordertype:OrderType;origin:Lookup;origincity:string;origincountry:string;originstate:string;paytype:LegPayType;readonly:boolean;revenuedate:Date;route:Lookup;sequence:number;timearrivalactual:Date;timearrivalestimated:Date;timedepartureactual:Date;timedepartureestimated:Date;timedrivepadding:number;timemarkarrival:boolean;timemarkdeparture:boolean;timemarkstart:boolean;timestartactual:Date;timestartestimated:Date;timewaitestimated:number;trackarrived:boolean;trackdeparted:boolean;trackstarted:boolean;type:LegType;typetext:string;ownerid:Lookup;owningteam:Lookup;owninguser:Lookup;statecode:StateCode;statuscode:LegStatus}
export type LegMember = keyof LegData;
export type LegCopyExclude = 'datestartoffset'|'description'|'descriptionlong'|'descriptionshort'|'destinationcity'|'destinationcountry'|'destinationstate'|'driverhoursbreak'|'drivetime'|'drivetimeminutes'|'geofencedestination'|'geofenceorigin'|'lineup'|'mapview'|'milesroute'|'milestotal'|'ordertype'|'origincity'|'origincountry'|'originstate'|'readonly'|'revenuedate'|'timearrivalactual'|'timedepartureactual'|'timestartactual'|'typetext'|'ownerid'|'owninguser';
export type LegCopy = Omit<LegData, LegCopyExclude>;
export type LegCopyMember = keyof LegCopy
export type LegCopyOverride = {appointmentearliest:Date,appointmentlatest:Date,datestart:Date,legid:string,name:string,order:any,readonly:boolean,timearrivalestimated:Date,timedepartureestimated:Date,timemarkarrival:boolean,timemarkdeparture:boolean,timemarkstart:boolean,timestartestimated:Date,trackarrived:boolean,trackdeparted:boolean,trackstarted:boolean,owningteam:any,statuscode:LegStatus}

export class Order {
    public static Info: {[key in OrderMember]: MetadataField} = {'accessorial':{id:'accessorial',type:'number',fieldType:FieldType.Simple,init:0,copy:true,calc:true},'accessorialdiscount':{id:'accessorialdiscount',type:'number',fieldType:FieldType.Simple,init:0,copy:true,calc:true},'additionalcontactname':{id:'additionalcontactname',type:'string',fieldType:FieldType.Simple,nullable:true,copy:true},'additionalcontactemail':{id:'additionalcontactemail',type:'string',fieldType:FieldType.Simple,nullable:true,copy:true},'additionalcontactphone':{id:'additionalcontactphone',type:'string',fieldType:FieldType.Simple,nullable:true,copy:true},'billto':{id:'billto',type:'customer',fieldType:FieldType.Lookup,copy:true},'billtotext':{id:'billtotext',type:'string',fieldType:FieldType.Simple,readOnly:true},'billtype':{id:'billtype',type:'BillType',fieldType:FieldType.Picklist,init:BillType.Shipper,copy:true,calc:true},'consignee':{id:'consignee',type:'customer',fieldType:FieldType.Lookup,gridLock:true,copy:true},'detention':{id:'detention',type:'number',fieldType:FieldType.Simple,init:0,copy:true,calc:true},'fuel':{id:'fuel',type:'number',fieldType:FieldType.Simple,init:0,copy:true,calc:true},'fuelfixedmiles':{id:'fuelfixedmiles',type:'boolean',fieldType:FieldType.Simple,init:0,copy:true,calc:true},'fuelfixedmilesamount':{id:'fuelfixedmilesamount',type:'number',fieldType:FieldType.Simple,init:0,copy:true,calc:true},'fuelfixedpct':{id:'fuelfixedpct',type:'number',fieldType:FieldType.Simple,init:0,copy:true,calc:true},'fuelflat':{id:'fuelflat',type:'number',fieldType:FieldType.Simple,init:0,copy:true,calc:true},'fuelpermile':{id:'fuelpermile',type:'number',fieldType:FieldType.Simple,init:0,copy:true,calc:true},'fuelsurchargepct':{id:'fuelsurchargepct',type:'number',fieldType:FieldType.Simple,init:0,copy:true,calc:true},'fueltype':{id:'fueltype',type:'FuelType',fieldType:FieldType.Picklist,init:FuelType.SurchargePercent,copy:true,calc:true},'invoice':{id:'invoice',type:'string',fieldType:FieldType.Simple,gridLock:true},'linehaulbase':{id:'linehaulbase',type:'number',fieldType:FieldType.Simple,init:0,copy:true,calc:true},'linehauldiscount':{id:'linehauldiscount',type:'number',fieldType:FieldType.Simple,init:0,copy:true,calc:true},'linehauldiscountpct':{id:'linehauldiscountpct',type:'number',fieldType:FieldType.Simple,init:0,copy:true,calc:true},'linehauldiscounttoggle':{id:'linehauldiscounttoggle',type:'boolean',fieldType:FieldType.Simple,init:true,copy:true,calc:true},'linehaulgross':{id:'linehaulgross',type:'number',fieldType:FieldType.Simple,init:0,copy:true,calc:true},'linehaulnet':{id:'linehaulnet',type:'number',fieldType:FieldType.Simple,init:0,copy:true,calc:true},'loadcomment':{id:'loadcomment',type:'string',fieldType:FieldType.Simple,nullable:true,copy:true},'loadcommodity':{id:'loadcommodity',type:'string',fieldType:FieldType.Simple,copy:true},'loadexpedited':{id:'loadexpedited',type:'boolean',fieldType:FieldType.Simple,init:false,copy:true,calc:true},'loadhazardous':{id:'loadhazardous',type:'boolean',fieldType:FieldType.Simple,init:false,copy:true,calc:true},'loadlength':{id:'loadlength',type:'number',fieldType:FieldType.Simple,init:0,copy:true,calc:true},'loadnumber':{id:'loadnumber',type:'string',fieldType:FieldType.Simple,nullable:true,copy:true},'loadreefer':{id:'loadreefer',type:'boolean',fieldType:FieldType.Simple,init:false,copy:true,calc:true},'loadtautliner':{id:'loadtautliner',type:'boolean',fieldType:FieldType.Simple,init:false,copy:true,calc:true},'loadtype':{id:'loadtype',type:'LoadType',fieldType:FieldType.Picklist,init:LoadType.Truckload,copy:true,calc:true},'loadweight':{id:'loadweight',type:'number',fieldType:FieldType.Simple,init:0,copy:true,calc:true},'milesempty':{id:'milesempty',type:'number',fieldType:FieldType.Simple,init:0,copy:true,calc:true},'milesloaded':{id:'milesloaded',type:'number',fieldType:FieldType.Simple,init:0,copy:true,calc:true},'milesrated':{id:'milesrated',type:'number',fieldType:FieldType.Simple,init:0,copy:true,calc:true},'milestotal':{id:'milestotal',type:'number',fieldType:FieldType.Simple,init:0,copy:true,calc:true},'name':{id:'name',type:'string',fieldType:FieldType.Simple,gridLock:true,copy:true},'namelong':{id:'namelong',type:'string',fieldType:FieldType.Simple,gridLock:true,copy:true},'legacytag':{id:'legacytag',type:'string',fieldType:FieldType.Simple,nullable:true,gridLock:true,copy:true},'orderdate':{id:'orderdate',type:'Date',fieldType:FieldType.Simple,init:new Date(),gridLock:true,copy:true,calc:true},'orderid':{id:'orderid',type:'string',fieldType:FieldType.Simple,readOnly:true,copy:true},'ordertype':{id:'ordertype',type:'OrderType',fieldType:FieldType.Picklist,init:null,copy:true},'otherrevenue':{id:'otherrevenue',type:'number',fieldType:FieldType.Simple,readOnly:true},'profit':{id:'profit',type:'number',fieldType:FieldType.Simple,init:0,gridLock:true,copy:true,calc:true},'profitpertotalmile':{id:'profitpertotalmile',type:'number',fieldType:FieldType.Simple,init:0,copy:true,calc:true},'quote':{id:'quote',type:'order',fieldType:FieldType.Lookup,nullable:true},'ratingadjustment':{id:'ratingadjustment',type:'number',fieldType:FieldType.Simple,init:0,copy:true,calc:true},'ratingbucket':{id:'ratingbucket',type:'BucketType',fieldType:FieldType.Picklist,init:BucketType.One,copy:true,calc:true},'ratingcomment':{id:'ratingcomment',type:'string',fieldType:FieldType.Simple,nullable:true,copy:true},'ratingtype':{id:'ratingtype',type:'RatingType',fieldType:FieldType.Picklist,init:RatingType.Standard,copy:true,calc:true},'ratingsummary':{id:'ratingsummary',type:'string',fieldType:FieldType.Simple,nullable:true},'readonly':{id:'readonly',type:'boolean',fieldType:FieldType.Simple,init:false,noFormLock:true,copy:true,calc:true},'revenuebeforefuel':{id:'revenuebeforefuel',type:'number',fieldType:FieldType.Simple,init:0,copy:true,calc:true},'revenuedate':{id:'revenuedate',type:'Date',fieldType:FieldType.Simple,nullable:true,calc:true},'revenueexcludeadjust':{id:'revenueexcludeadjust',type:'number',fieldType:FieldType.Simple,init:0,copy:true,calc:true},'revenueincludefuel':{id:'revenueincludefuel',type:'number',fieldType:FieldType.Simple,init:0,copy:true,calc:true},'revenueperloadedmile':{id:'revenueperloadedmile',type:'number',fieldType:FieldType.Simple,init:0,copy:true,calc:true},'revenuepertotalmile':{id:'revenuepertotalmile',type:'number',fieldType:FieldType.Simple,init:0,copy:true,calc:true},'revenuetotal':{id:'revenuetotal',type:'number',fieldType:FieldType.Simple,init:0,gridLock:true,copy:true,calc:true},'shipper':{id:'shipper',type:'customer',fieldType:FieldType.Lookup,gridLock:true,copy:true},'statecode':{id:'statecode',type:'StateCode',fieldType:FieldType.Picklist,noPrefixField:true},'statuscode':{id:'statuscode',type:'OrderStatus',fieldType:FieldType.Picklist,noPrefixField:true,gridLock:true},'trackcompleted':{id:'trackcompleted',type:'boolean',fieldType:FieldType.Simple,init:false},'trackerrors':{id:'trackerrors',type:'number',fieldType:FieldType.Simple,init:0},'trackload':{id:'trackload',type:'boolean',fieldType:FieldType.Simple,init:false},'trackstatus':{id:'trackstatus',type:'TrackStatus',fieldType:FieldType.Picklist},'upliftcanada':{id:'upliftcanada',type:'number',fieldType:FieldType.Simple,init:0,copy:true,calc:true},'upliftexpedited':{id:'upliftexpedited',type:'number',fieldType:FieldType.Simple,init:0,copy:true,calc:true},'uplifthazardous':{id:'uplifthazardous',type:'number',fieldType:FieldType.Simple,init:0,copy:true,calc:true},'upliftreefer':{id:'upliftreefer',type:'number',fieldType:FieldType.Simple,init:0,copy:true,calc:true},'uplifttautliner':{id:'uplifttautliner',type:'number',fieldType:FieldType.Simple,init:0,copy:true,calc:true}}
}

export class Leg {
    public static Info: {[key in LegMember]: MetadataField} = {'appointmentcomment':{id:'appointmentcomment',type:'string',fieldType:FieldType.Simple,nullable:true,copy:true},'appointmentearliest':{id:'appointmentearliest',type:'Date',fieldType:FieldType.Simple,nullable:true,copy:true},'appointmentlatest':{id:'appointmentlatest',type:'Date',fieldType:FieldType.Simple,nullable:true,copy:true},'comment':{id:'comment',type:'string',fieldType:FieldType.Simple,nullable:true,copy:true},'datestart':{id:'datestart',type:'Date',fieldType:FieldType.Simple,copy:true},'datestartoffset':{id:'datestartoffset',type:'number',fieldType:FieldType.Simple,readOnly:true,gridLock:true},'description':{id:'description',type:'string',fieldType:FieldType.Simple,readOnly:true,gridLock:true},'descriptionlong':{id:'descriptionlong',type:'string',fieldType:FieldType.Simple,readOnly:true},'descriptionshort':{id:'descriptionshort',type:'string',fieldType:FieldType.Simple,readOnly:true},'destination':{id:'destination',type:'customer',fieldType:FieldType.Lookup,copy:true},'destinationcity':{id:'destinationcity',type:'string',fieldType:FieldType.Simple,readOnly:true},'destinationcountry':{id:'destinationcountry',type:'string',fieldType:FieldType.Simple,readOnly:true},'destinationstate':{id:'destinationstate',type:'string',fieldType:FieldType.Simple,readOnly:true},'driverallocationpct':{id:'driverallocationpct',type:'number',fieldType:FieldType.Simple,init:0,copy:true},'driverallocationrev':{id:'driverallocationrev',type:'number',fieldType:FieldType.Simple,init:0,copy:true},'drivercostfixed':{id:'drivercostfixed',type:'number',fieldType:FieldType.Simple,init:0,copy:true},'drivercostburdened':{id:'drivercostburdened',type:'number',fieldType:FieldType.Simple,init:0,copy:true},'drivercostpayroll':{id:'drivercostpayroll',type:'number',fieldType:FieldType.Simple,init:0,copy:true},'driverhours':{id:'driverhours',type:'number',fieldType:FieldType.Simple,init:0,copy:true},'driverhoursbreak':{id:'driverhoursbreak',type:'number',fieldType:FieldType.Simple,init:0,nullable:true},'driverhoursreg':{id:'driverhoursreg',type:'number',fieldType:FieldType.Simple,init:0,nullable:true,copy:true},'driverhoursot':{id:'driverhoursot',type:'number',fieldType:FieldType.Simple,init:0,nullable:true,copy:true},'driverhourlyratereg':{id:'driverhourlyratereg',type:'number',fieldType:FieldType.Simple,init:0,nullable:true,copy:true},'driverhourlyrateot':{id:'driverhourlyrateot',type:'number',fieldType:FieldType.Simple,init:0,nullable:true,copy:true},'driverhourlyrateoverride':{id:'driverhourlyrateoverride',type:'number',fieldType:FieldType.Simple,init:false,copy:true},'driverrevenuepct':{id:'driverrevenuepct',type:'number',fieldType:FieldType.Simple,init:0,copy:true},'driverrevenue':{id:'driverrevenue',type:'number',fieldType:FieldType.Simple,init:0,copy:true},'drivetime':{id:'drivetime',type:'string',fieldType:FieldType.Simple,readOnly:true,gridLock:true},'drivetimeminutes':{id:'drivetimeminutes',type:'number',fieldType:FieldType.Simple,readOnly:true},'equipmentdolly':{id:'equipmentdolly',type:'equipment',fieldType:FieldType.Lookup,nullable:true,copy:true},'equipmenttractor':{id:'equipmenttractor',type:'equipment',fieldType:FieldType.Lookup,nullable:true,gridLock:true,copy:true},'equipmenttrailer1':{id:'equipmenttrailer1',type:'equipment',fieldType:FieldType.Lookup,nullable:true,copy:true},'equipmenttrailer2':{id:'equipmenttrailer2',type:'equipment',fieldType:FieldType.Lookup,nullable:true,copy:true},'geofencedestination':{id:'geofencedestination',type:'string',fieldType:FieldType.Simple,readOnly:true},'geofenceorigin':{id:'geofenceorigin',type:'string',fieldType:FieldType.Simple,readOnly:true},'legid':{id:'legid',type:'string',fieldType:FieldType.Simple,readOnly:true,copy:true},'lineup':{id:'lineup',type:'string',fieldType:FieldType.Simple,readOnly:true,gridLock:true},'mapview':{id:'mapview',type:'string',fieldType:FieldType.Simple,readOnly:true,gridLock:true},'milesadditional':{id:'milesadditional',type:'number',fieldType:FieldType.Simple,copy:true},'milesroute':{id:'milesroute',type:'number',fieldType:FieldType.Simple,readOnly:true,gridLock:true},'milestotal':{id:'milestotal',type:'string',fieldType:FieldType.Simple,readOnly:true},'name':{id:'name',type:'string',fieldType:FieldType.Simple,gridLock:true,copy:true},'order':{id:'order',type:'order',fieldType:FieldType.Lookup,readOnly:true,gridLock:true,copy:true},'ordertype':{id:'ordertype',type:'OrderType',fieldType:FieldType.Picklist,readOnly:true},'origin':{id:'origin',type:'customer',fieldType:FieldType.Lookup,copy:true},'origincity':{id:'origincity',type:'string',fieldType:FieldType.Simple,readOnly:true},'origincountry':{id:'origincountry',type:'string',fieldType:FieldType.Simple,readOnly:true},'originstate':{id:'originstate',type:'string',fieldType:FieldType.Simple,readOnly:true},'paytype':{id:'paytype',type:'LegPayType',fieldType:FieldType.Picklist,init:LegPayType.RevenuePercent,copy:true},'readonly':{id:'readonly',type:'boolean',fieldType:FieldType.Simple},'revenuedate':{id:'revenuedate',type:'Date',fieldType:FieldType.Simple,readOnly:true},'route':{id:'route',type:'route',fieldType:FieldType.Lookup,gridLock:true,copy:true},'sequence':{id:'sequence',type:'number',fieldType:FieldType.Simple,gridLock:true,copy:true},'timearrivalactual':{id:'timearrivalactual',type:'Date',fieldType:FieldType.Simple,nullable:true},'timearrivalestimated':{id:'timearrivalestimated',type:'Date',fieldType:FieldType.Simple,copy:true},'timedepartureactual':{id:'timedepartureactual',type:'Date',fieldType:FieldType.Simple,nullable:true},'timedepartureestimated':{id:'timedepartureestimated',type:'Date',fieldType:FieldType.Simple,gridLock:true,copy:true},'timedrivepadding':{id:'timedrivepadding',type:'number',fieldType:FieldType.Simple,copy:true},'timemarkarrival':{id:'timemarkarrival',type:'boolean',fieldType:FieldType.Simple,copy:true},'timemarkdeparture':{id:'timemarkdeparture',type:'boolean',fieldType:FieldType.Simple,copy:true},'timemarkstart':{id:'timemarkstart',type:'boolean',fieldType:FieldType.Simple,copy:true},'timestartactual':{id:'timestartactual',type:'Date',fieldType:FieldType.Simple,nullable:true},'timestartestimated':{id:'timestartestimated',type:'Date',fieldType:FieldType.Simple,gridLock:true,copy:true},'timewaitestimated':{id:'timewaitestimated',type:'number',fieldType:FieldType.Simple,copy:true},'trackarrived':{id:'trackarrived',type:'boolean',fieldType:FieldType.Simple,copy:true},'trackdeparted':{id:'trackdeparted',type:'boolean',fieldType:FieldType.Simple,copy:true},'trackstarted':{id:'trackstarted',type:'boolean',fieldType:FieldType.Simple,copy:true},'type':{id:'type',type:'LegType',fieldType:FieldType.Picklist,gridLock:true,copy:true},'typetext':{id:'typetext',type:'string',fieldType:FieldType.Simple,readOnly:true},'ownerid':{id:'ownerid',type:'systemuser',fieldType:FieldType.Lookup,noPrefixField:true,gridLock:true},'owningteam':{id:'owningteam',type:'team',fieldType:FieldType.Lookup,noPrefixField:true,readOnly:true,copy:true},'owninguser':{id:'owninguser',type:'systemuser',fieldType:FieldType.Lookup,noPrefixField:true,readOnly:true},'statecode':{id:'statecode',type:'StateCode',fieldType:FieldType.Picklist,noPrefixField:true,copy:true},'statuscode':{id:'statuscode',type:'LegStatus',fieldType:FieldType.Picklist,noPrefixField:true,copy:true}}
    public static getDurationHours(start: Date, departure: Date, breakHours: number): number {
        const brk = (breakHours == null ? 0 : breakHours);
        const hours = Utility.round((Utility.getDaysOffset(departure, start, false) * 24.0) - brk, 1);
        return (hours > 0 ? hours : 0);
    }
}