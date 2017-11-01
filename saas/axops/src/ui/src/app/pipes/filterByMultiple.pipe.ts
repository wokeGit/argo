import { Pipe, Injectable, PipeTransform } from '@angular/core';

@Pipe({
    name: 'axFilterByMultiple'
})
@Injectable()
export class FilterByMultiplePipe implements PipeTransform {
    transform(items: string[], searchItem: string, propertyNames: string[]): any {
        if (!items || items.length === 0 || !searchItem) {
            return items;
        }

        return items.filter((item: string) => {
            let multiValueString = '';
            propertyNames.forEach(property => {
                if (item.hasOwnProperty(property)) {
                    multiValueString += item[property];
                }
            });
            return multiValueString.toLowerCase().indexOf(searchItem.toLowerCase()) !== -1;
        });
    }
}
