import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'currencyGuru' })

export class CurrencyGuruPipe implements PipeTransform {
    transform(value: number, showSymbol = true): any {
        let amount = parseFloat((value || 0).toString()).toFixed(2);

        let afterPoint = '';
        if (amount.indexOf('.') > 0) {
            afterPoint = amount.substring(amount.indexOf('.'), amount.length);
        }

        amount = Math.floor(value || 0).toString();

        let lastThree = amount.substring(amount.length - 3);
        const otherNumbers = amount.substring(0, amount.length - 3);
        if (otherNumbers !== '') { lastThree = ',' + lastThree; }

        const formattedAmount = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree + afterPoint;
        return (showSymbol ? '₹' : '') + formattedAmount;
    }
}