/* eslint-disable no-unused-vars */
export enum Org {Prefix = 'cr72c_', NotifyId = 'Woot.Application'}
export enum StateCode {Active = 0, Inactive = 1}
export enum OrderStatus {NotStarted = 1, InProgress = 290640000, ShipComplete = 290640001, RateFinal = 290640002, Invoiced = 290640003, Inactive = 2}
export enum Operator {Equal = 'eq', NotEqual = 'ne', In = 'in', GreaterThan = 'gt', LessThan = 'lt', GreaterThanOrEqual = 'ge', LessThanOrEqual = 'le'}
export enum EquipmentType {Tractor = 290640000, Dolly = 290640001, Trailer = 290640002, ServiceTruck = 290640003, SoloTruck = 290640004, Forklift = 290640005, ReeferUnit = 290640006}
export enum TrackStatus {Okay = 290640000, Retry = 290640001, Failed = 290640002}
export enum FieldPrefix {Lookup = '*', Picklist = '$', Date = '@', Normal = ''}
export enum FieldType {Lookup = 'Lookup', Picklist = 'Picklist', Date = 'Date', Simple = 'Simple', Json = 'Json'}
export enum LegType {Pickup = 290640000, Delivery = 290640001, Spot = 290640002, Empty = 290640003, AllocatedMiles = 290640004, Stop = 290640005}
export enum LegStatus {NotStarted = 1, InProgress = 290640000, Completed = 290640001, Inactive = 2}
export enum LocationType {Customer = 290640000, City = 290640001, CustomerBillToOnly = 290640002}
export enum SystemGuids {WorkerConfig = '958fe41e-30c9-eb11-bacc-00224809653c'}
export enum WorkerType {Driver = 290640000, Office = 290640001, Other = 290640002}
export enum LegPayType {RevenuePercent = 290640000, Hourly = 290640001, FixedAmount = 290640002, Unpaid = 290640003}
export enum PayType {Hourly = 290640000, Salary = 290640001, RevenuePercent = 290640002, FixedAmount = 290640003, Holiday = 290640004, PTO = 290640005, Layover = 290640006}
export enum PayrollItemStatus {Draft = 1, Final = 290640000}
export enum EntryType {System = 290640000, Manual = 290640001}
export enum PayrollStatus {Draft = 1, Final = 290640000}
export enum BucketType {One = 290640000, Two = 290640001, Three = 290640002, Four = 290640003, Five = 290640004, Six = 290640005}
export enum FuelType {SurchargePercent = 290640000, FixedPercent = 290640001, PerMile = 290640002, FlatAmount = 290640003}
export enum BillType {Shipper = 290640000, Consignee = 290640001, ThirdParty = 290640002, NonBillable = 290640003}
export enum LoadType {Truckload = 290640000, LTL = 290640001}
export enum OrderType {Order = 290640000, Quote = 290640001, Contract = 290640002}
export enum RatingType {Standard = 290640000, QuoteContract = 290640001}
export enum Config {OrderModel = 'Woot.OrderModel', Workers = 'Woot.Workers', RatesCurrent = 'Woot.RateTable.Current', RatesPrevious = 'Woot.RateTable.Previous'}
