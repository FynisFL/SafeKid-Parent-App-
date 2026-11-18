export const Native = {
 get available(){return Boolean(globalThis.SafeKidNative);},
 get bridge(){return globalThis.SafeKidNative;},
};
