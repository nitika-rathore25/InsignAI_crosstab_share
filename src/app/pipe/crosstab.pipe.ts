import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'appCrossFilter' })
export class CrosstabPipe implements PipeTransform {

    transform(items: any[], searchText: string): any[] {
        if (!items) {
            return [];
        }
        if (!searchText) {
            return items;
        }
        searchText = searchText.toLocaleLowerCase();

        return items.filter(it => {
            return it.title.toLocaleLowerCase().includes(searchText);
        });
    }
}