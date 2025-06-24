import { Component } from '@angular/core';
import { ElementsTableComponent } from './components/table/elements-table';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ElementsTableComponent],
  template: `<app-elements-table />`
})
export class App {}
