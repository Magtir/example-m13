import { AfterContentInit, ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { BreadcrumbInterface } from '@common/interfaces/breadcrumb.interface';
import { OptionItem } from '@common/interfaces/options.interface';
import { BehaviorSubject, Subject } from 'rxjs';
import { filter, finalize, first, switchMap, takeUntil, tap } from 'rxjs/operators';
import { StoresApiService } from '@common/services/api/stores-api.service';
import { ActivatedRoute } from '@angular/router';
import { StoreModelInterface } from '@common/interfaces/store-model.interface';
import { FormControl } from '@angular/forms';
import { SortingInterface } from '@common/interfaces/sorting.interface';
import { PaginatedContentInterface } from '@common/interfaces/api/common-api.interface';
import { StoresPageDataInterface } from '@common/interfaces/pages-data.interface';

@Component({
  selector: 'app-stores-list-page',
  templateUrl: './stores-list-page.component.html',
  styleUrls: ['./stores-list-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StoresListPageComponent implements OnInit, AfterContentInit, OnDestroy {
  componentDestroyed$ = new Subject();

  breadcrumbs: BreadcrumbInterface[] = [
    { value: 'Main', href: '/' },
    { value: 'Stores' }
  ];

  list$ = new BehaviorSubject<StoreModelInterface[]>([]);

  controlSelectedCategory = new FormControl('');
  controlQuery = new FormControl('');
  options$ = new BehaviorSubject<OptionItem[]>([
    { title: 'The first', value: 2 },
    { title: 'The second one is very long like this', value: 5 },
    { title: 'The third', value: 4 }
  ]);

  search$ = new Subject();

  limit: number;
  sorting: SortingInterface[];
  storesIsLoadingPage$ = new BehaviorSubject(false);
  storesIsLoadingNextPage$ = new BehaviorSubject(false);
  storesIsError$ = new BehaviorSubject(false);
  lastItems$ = new BehaviorSubject(0);

  constructor(private storesApiService: StoresApiService,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    const pageData: StoresPageDataInterface = this.activatedRoute.snapshot.data.pageData;
    if (pageData) {
      this.initPageData(pageData);
    } else {
      this.storesIsError$.next(true);
    }
  }

  ngAfterContentInit(): void {
    this.initSelectCategory();
    this.initSearch();
  }

  ngOnDestroy(): void {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }

  initSelectCategory(): void {
    this.controlSelectedCategory.valueChanges
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe(() => this.search$.next());
  }

  initSearch(): void {
    this.search$
      .pipe(
        takeUntil(this.componentDestroyed$),
        tap((nextPage?: boolean) => {
          if (!nextPage) {
            this.list$.next([]);
            this.storesIsLoadingPage$.next(true);
          } else {
            this.storesIsLoadingNextPage$.next(true);
          }
        }),
        filter((nextPage?: boolean) => !nextPage || this.lastItems$.value > 0),
        switchMap(() =>
          this.storesApiService.searchStores({
            query: this.controlQuery.value,
            limit: this.limit,
            offset: this.list$.value.length,
            sorting: this.sorting,
            categoryId: this.controlSelectedCategory.value
          })
            .pipe(
              first(),
              takeUntil(this.componentDestroyed$),
              finalize(() => {
                this.storesIsLoadingPage$.next(false);
                this.storesIsLoadingNextPage$.next(false);
              })
            )
        )
      )
      .subscribe(data => {
        this.parseData(data);
      }, () => {
        this.storesIsError$.next(true);
      });
  }

  parseData(data: PaginatedContentInterface<StoreModelInterface>): void {
    this.list$.next([...this.list$.value, ...data.data]);
    this.lastItems$.next(Math.min(data.totalItems - this.list$.value.length, this.limit));
  }

  initPageData(data: StoresPageDataInterface): void {
    if (data.limit) {
      this.limit = data.limit;
    }
    if (data.sorting) {
      this.sorting = data.sorting;
    }
    this.parseData(data.stores);
  }

  nextPage(): void {
    this.search$.next(true);
  }

  clickSearch(): void {
    this.search$.next();
  }

  clickAutocomplete(text): void {
    this.controlQuery.setValue(text);
    this.search$.next();
  }
}
