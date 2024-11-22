import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'appFilter' })
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }
    searchText = searchText.toString().toLocaleLowerCase();
    return items.filter((it) => {
      if (it.studyName) {
        return (
          it.studyName.toString().toLocaleLowerCase().includes(searchText) ||
          it.name.toString().toLocaleLowerCase().includes(searchText) ||
          it.createdOn.toString().toLocaleLowerCase().includes(searchText) ||
          it.studyState.toString().toLocaleLowerCase().includes(searchText)
        );
      } else if (it.firstName) {
        return (
          it.firstName.toString().toLocaleLowerCase().includes(searchText) ||
          it.lastName.toString().toLocaleLowerCase().includes(searchText)
        );
      }
    });

    // return items.filter((it) => {
    //   return (
    //     it.studyName.toString().toLocaleLowerCase().includes(searchText) ||
    //     it.name.toString().toLocaleLowerCase().includes(searchText) ||
    //     it.createdOn.toString().toLocaleLowerCase().includes(searchText) ||
    //     it.studyState.toString().toLocaleLowerCase().includes(searchText)
    //   );
    // });
  }
}

// import { Pipe, PipeTransform } from '@angular/core';

// @Pipe({ name: 'appFilter' })
// export class FilterPipe implements PipeTransform {
//   transform(items: any[], searchText: string, keys: string[]): any[] {
//     if (!items) {
//       return [];
//     }
//     if (!searchText) {
//       return items;
//     }
//     searchText = searchText.toString().toLocaleLowerCase();
//     console.log(searchText);
//     if (keys?.length > 0) {
//       return items.filter((it) => {
//         return this.returnFilter(it, searchText, keys);
//         // return it.studyName.toLocaleLowerCase().includes(searchText);
//       });
//     }
//   }
//   returnFilter(it, searchText, keys) {
//     let temp = false;
//     keys.forEach((element) => {
//       if (it[element]) {
//         if (it[element].toString().toLocaleLowerCase().includes(searchText)) {
//           temp = true;
//         }
//       }

//       console.log(temp);
//     });
//     return temp;
//   }
// }
