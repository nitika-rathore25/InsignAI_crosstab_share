import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrosstabRoutingModule } from './crosstab-routing.module';
import { CrosstabComponent } from './crosstab.component';
import { EditBannerComponent } from './edit-banner/edit-banner.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilterPipe } from '../pipe/filter.pipe';
import { EditTableListComponent } from './edit-table-list/edit-table-list.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { HeaderComponent } from '../header/header.component';
import { ToastrService } from 'ngx-toastr';
import { SystemService } from '../service/system.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DownloadAllComponent } from './download-all/download-all.component';
import { LoaderService } from '../service/loader.service';
import { MatExpansionModule } from '@angular/material/expansion';

@NgModule({
  declarations: [
    CrosstabComponent,
    EditBannerComponent,
    FilterPipe,
    EditTableListComponent,
    HeaderComponent,
    DownloadAllComponent
  ],
  imports: [
    CommonModule,
    CrosstabRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DragDropModule,
    MatTooltipModule,
    MatExpansionModule
  ],
  exports: [
    CrosstabComponent,
    EditBannerComponent,
    FilterPipe,
    EditTableListComponent,
  ],
  providers: [ToastrService, SystemService],
})
export class CrosstabModule { }
