import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AppComponent } from "./app.component";
import { PopoverComponent } from "./components/popover/popover.component";
import { TableComponent } from "./components/table/table.component";
import { ModalComponent } from "./components/modal/modal.component";

@NgModule({
  declarations: [
    AppComponent,
    PopoverComponent,
    TableComponent,
    ModalComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
