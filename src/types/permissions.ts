export interface IPermissionsMap {
  [role: string]: {
    [resource: string]: Array<string>;
  }
};