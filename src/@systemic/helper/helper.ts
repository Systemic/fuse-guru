export class Guru {
    static isValidObj(obj: any): boolean {
        return obj !== undefined && obj !== null;
    }
    static isValidList(obj: any): boolean {
        return this.isValidObj(obj) && obj.length > 0;
    }
    static isString(obj: any): boolean {
        return this.isValidObj(obj) && typeof obj === 'string';
    }
    static isEmptyString(obj: any): boolean {
        return this.isString(obj) && obj === '';
    }
}
