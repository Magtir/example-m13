import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { catchError, first, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { StoresApiService } from '@common/services/api/stores-api.service';
import { BREAKPOINTS, MatchMediaService } from '@common/services/match-media.service';
import { SortDirEnum } from '@common/enums/sort-dir.enum';
import { SortingInterface } from '@common/interfaces/sorting.interface';
import { StoresPageDataInterface } from '@common/interfaces/pages-data.interface';

@Injectable()
export class StoresListPageResolver implements Resolve<any> {
  constructor(private storesApiService: StoresApiService,
              private matchMediaService: MatchMediaService) {
  }

  resolve(): Observable<StoresPageDataInterface> {
    const media = this.matchMediaService.currentMedia$.value;
    let limit: number;
    switch (true) {
      case media[BREAKPOINTS.small]:
        limit = 12;
        break;

      case media[BREAKPOINTS.big]:
        limit = 18;
        break;

      default:
        limit = 24;
    }
    const request = {
      limit,
      sorting: [{
        order: SortDirEnum.asc,
        type: 'CLICKS_COUNT'
      }] as SortingInterface[]
    };

    return this.storesApiService.searchStores(request, 'stores-page-list')
      .pipe(first(), catchError(() => of(null)), map(response => ({
        stores: response,
        limit: request.limit,
        sorting: request.sorting
      })));
  }
}
