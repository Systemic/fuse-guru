import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import { Guru } from '@systemic/helper';
/*
 * Convert date one format from another format
 * Takes an srcFormat argument that defaults to DD-MM-YYYY h:mm:A.
 * Takes an destFormat argument that defaults to Do MMM h:mm A | Do MMM YYYY h:mm A.
 * Usage:
 *   value | dateGuru:srcFormat:destFormat
 * Example:
 *   {{ 28-11-2019 12:11:PM | dateGuru:'DD-MM-YYYY h:mm:A':'Do MMM h:mm A' }}
 *   formats to: 28th Nov 12:11 PM
*/
@Pipe({ name: 'dateGuru' })
export class DateGuruPipe implements PipeTransform {
    transform(value: string, srcFormat?: string, destFormat?: string): string {
        try {
            const dt = moment(value, srcFormat || 'DD-MM-YYYY h:mm:A');
            if (!Guru.isValidObj(destFormat)) {
                if (dt.year() === moment().year()) {
                    destFormat = 'Do MMM h:mm A';
                } else {
                    destFormat = 'Do MMM YYYY h:mm A';
                }
            }
            return dt.format(destFormat);
        } catch {
            return 'N/A';
        }
    }
}