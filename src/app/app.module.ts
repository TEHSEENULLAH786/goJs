import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DiagramComponent } from './diagram/diagram.component';
import { HttpClientModule } from '@angular/common/http';
import { InspectorComponent } from './inspector/inspector.component';

@NgModule({
  declarations: [
    AppComponent,
    DiagramComponent,
    InspectorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
