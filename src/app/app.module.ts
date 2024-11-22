import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SystemService } from './service/system.service';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { LoaderComponent } from './loader/loader.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';

@NgModule({
  declarations: [
    AppComponent,
    LoaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatMenuModule,
    ToastrModule.forRoot({
      // timeOut: 10000000,
      positionClass: 'toast-bottom-left',
      preventDuplicates: true,
    }),
    HttpClientModule,
    MatExpansionModule,
    BrowserAnimationsModule
  ],
  providers: [SystemService,
    , { provide: LocationStrategy, useClass: HashLocationStrategy }],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
