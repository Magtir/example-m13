import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { StoresListPageComponent } from './stores-list-page.component';
import { BreadcrumbsModule } from '@common/components/breadcrumbs/breadcrumbs.module';
import { PipesModule } from '@common/pipes/pipes.module';
import { SeoListLinksModule } from '@common/components/seo-list-links/seo-list-links.module';
import { SeoListLinksWithCaptionModule } from '@common/components/seo-list-links-with-caption/seo-list-links-with-caption.module';
import { SeoListCategoriesModule } from '@common/components/seo-list-categories/seo-list-categories.module';
import { SeoListStoresModule } from '@common/components/seo-list-stores/seo-list-stores.module';
import { InputSearchModule } from '@common/components/input-search/input-search.module';
import { CardStoreModule } from '@common/components/card-store/card-store.module';
import { ScrollUpDirectiveModule } from '@common/directives/scroll-up/scroll-up-directive.module';
import { SelectModule } from '@common/components/form/select/select.module';
import { StoresListPageResolver } from './stores-list-page.resolver';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonLoaderModule } from '@common/directives/button-loader/button-loader.module';
import { NotFoundModule } from '@common/components/not-found/not-found.module';

const routes: Routes = [
  {
    path: '',
    component: StoresListPageComponent,
    resolve: { pageData: StoresListPageResolver },
    data: {
      meta: {
        title: 'Stores'
      }
    }
  }
];

@NgModule({
  declarations: [
    StoresListPageComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    BreadcrumbsModule,
    PipesModule,
    SeoListLinksModule,
    SeoListLinksWithCaptionModule,
    SeoListCategoriesModule,
    SeoListStoresModule,
    InputSearchModule,
    CardStoreModule,
    ScrollUpDirectiveModule,
    SelectModule,
    ReactiveFormsModule,
    ButtonLoaderModule,
    NotFoundModule
  ],
  providers: [
    StoresListPageResolver
  ]
})
export class StoresListPageModule {
}
