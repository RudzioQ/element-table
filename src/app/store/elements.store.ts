import { Injectable, signal, computed } from '@angular/core';
import { PeriodicElement, ELEMENT_DATA } from '../models/element.model';

@Injectable({ providedIn: 'root' })
export class ElementsStore {
    private elements = signal<PeriodicElement[]>([]);
    private filter = signal<string>('');
    private loading = signal<boolean>(false);

    readonly filteredElements = computed(() => {
        const query = this.filter().toLowerCase();
        return this.elements().filter(e =>
            Object.values(e).some(val =>
                val.toString().toLowerCase().includes(query)
            )
        );
    });

    readonly isLoading = this.loading;

    loadElements() {
        this.loading.set(true);
        setTimeout(() => {
            this.elements.set(ELEMENT_DATA);
            this.loading.set(false);
        }, 1000);
    }

    setFilter(value: string) {
        this.filter.set(value);
    }

    updateElement(position: number, updated: PeriodicElement) {
        this.elements.update(prev =>
            prev.map(el => (el.position === position ? { ...updated } : el))
        );
    }
}
