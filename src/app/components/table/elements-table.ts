import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { ElementsStore } from '../../store/elements.store';
import { EditDialogComponent } from '../edit-dialog/edit-dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { fromEvent, Subscription } from 'rxjs';
import { debounceTime, map, distinctUntilChanged } from 'rxjs/operators';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-elements-table',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatTableModule,
        MatFormFieldModule,
        MatInputModule,
        MatDialogModule,
        MatIconModule,
        MatProgressSpinnerModule
    ],
    templateUrl: './elements-table.html',
    styleUrl: './elements-table.scss'
})
export class ElementsTableComponent implements OnInit, AfterViewInit, OnDestroy {
    private store = inject(ElementsStore);
    private dialog = inject(MatDialog);

    displayedColumns = ['position', 'name', 'weight', 'symbol', 'actions'];

    get data() {
        return this.store.filteredElements();
    }

    @ViewChild('filterInput') filterInput!: ElementRef<HTMLInputElement>;
    private filterSubscription?: Subscription;

    ngOnInit() {
        this.store.loadElements();
    }

    ngAfterViewInit() {
        this.filterSubscription = fromEvent(this.filterInput.nativeElement, 'input').pipe(
            map((event: Event) => (event.target as HTMLInputElement).value),
            debounceTime(2000),
            distinctUntilChanged()
        ).subscribe(value => {
            this.store.setFilter(value);
        });
    }

    ngOnDestroy() {
        this.filterSubscription?.unsubscribe();
    }

    onEdit(element: any): void {
        const dialogRef = this.dialog.open(EditDialogComponent, {
            data: { ...element }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.store.updateElement(element.position, result);
            }
        });
    }

    isLoading = this.store.isLoading;
}
