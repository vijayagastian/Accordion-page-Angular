import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgApexchartsModule } from 'ng-apexcharts';
import {MatSelectModule} from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { LinechartComponent } from './linechart/linechart.component';
import { BarchartComponent } from './barchart/barchart.component';
import { PiechartComponent } from './piechart/piechart.component';
import {CdkAccordionModule} from '@angular/cdk/accordion';
import { ChartsComponent } from './charts/charts.component';
import { TimelinechartComponent } from './timelinechart/timelinechart.component';
import { MapsComponent } from './maps/maps.component';

@NgModule({
  declarations: [
    AppComponent,
    LinechartComponent,
    BarchartComponent,
    PiechartComponent,
    ChartsComponent,
    TimelinechartComponent,
    MapsComponent,
   
  ],
  imports: [
    BrowserModule,FormsModule, MatSelectModule, MatFormFieldModule,
    ReactiveFormsModule,NgApexchartsModule,
    AppRoutingModule,CdkAccordionModule
    
  ],
  providers: [provideHttpClient(withInterceptorsFromDi())],
  bootstrap: [AppComponent]
})
export class AppModule { }
