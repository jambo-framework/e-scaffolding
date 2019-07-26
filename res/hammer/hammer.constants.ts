// ACTION TYPES
export const HAMMER_SUMMARY = '@hammer/SUMMARY';
export const HAMMER_LIST = '@hammer/LIST';
export const PAGINATION = '@hammer/PAGINATION';

// CACHE KEY
export const HammerListDataKey = 'manageHammer';
export const HammerListGetCount = 20;
export const HammerListShowCount = 10;
export const HammerSearchOptions = 'hammerSearchOptions';

// FILTER KEY
export const HammerIMEIKey = 'ivdIds';
export const LicensePlateKey = 'vrns';
export const VinKey = 'vins';
export const VendorKey = 'manufacturers';
export const StatusKey = 'status';
export const OrgKey = 'enterpriseIds';

// FILTER DATASOURCE
export const vendorDataSource = [
  { text: 'ACTIA', value: 'ACTIA' },
  { text: 'CNLAUNCH', value: 'CNLAUNCH' }
];
export const statusDataSource = [
  { text: 'NEW', value: 'NEW' },
  { text: 'ACTIVE', value: 'ACTIVE' }
];

export const HAMMER_DETAIL = '@hammer/DETAIL';

export const EDIT_HAMMER = '@hammer/EDIT';

export const HAMMER_PAIRED = '@hammer/PAIRED';
export const HAMMER_UNPAIRED = '@hammer/UNPAIRED';

export const prefixCls = 'fms-hammer';
export const hammerPrefixCls = 'fms-hammer-hammer';
