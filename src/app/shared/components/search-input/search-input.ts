import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    ViewChild,
    signal,
    inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { SearchService } from '../../services/search.service';

export interface SearchInputProps {
    placeholder?: string;
    autoFocus?: boolean;
    showClearButton?: boolean;
    debounceTime?: number;
}

@Component({
    selector: 'app-search-input',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './search-input.html',
    styleUrl: './search-input.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'block w-full',
        role: 'search'
    }
})
export class SearchInputComponent implements OnInit, OnDestroy, SearchInputProps {
    @Input() placeholder = 'Search products...';
    @Input() autoFocus = false;
    @Input() showClearButton = true;
    @Input() debounceTime = 300;

    @Output() search = new EventEmitter<string>();
    @Output() clear = new EventEmitter<void>();
    @Output() focus = new EventEmitter<void>();
    @Output() blur = new EventEmitter<void>();

    @ViewChild('searchInput', { static: true }) searchInput!: ElementRef<HTMLInputElement>;

    private readonly searchService = inject(SearchService);
    private readonly destroy$ = new Subject<void>();

    protected readonly searchQuery = signal('');
    protected readonly isSearching = signal(false);
    protected readonly isFocused = signal(false);

    ngOnInit(): void {
        this.setupInputHandling();
        this.setupSearchServiceSubscription();

        if (this.autoFocus) {
            setTimeout(() => this.focusInput(), 0);
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private setupInputHandling(): void {
        const inputElement = this.searchInput.nativeElement;

        // Setup debounced input handling
        // fromEvent(inputElement, 'input')
        //     .pipe(
        //         debounceTime(this.debounceTime),
        //         distinctUntilChanged(),
        //         takeUntil(this.destroy$)
        //     )
        //     .subscribe(() => {
        //         const query = inputElement.value.trim();
        //         this.searchQuery.set(query);
        //         this.search.emit(query);
        //         this.searchService.search(query);
        //     });

        // Setup focus/blur handling
        fromEvent(inputElement, 'focus')
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.isFocused.set(true);
                this.focus.emit();
            });

        fromEvent(inputElement, 'blur')
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.isFocused.set(false);
                this.blur.emit();
            });

        fromEvent(inputElement, 'keydown')
            .pipe(takeUntil(this.destroy$))
            .subscribe((event: Event) => {
                this.handleKeyDown(event as KeyboardEvent);
            });
    }

    private setupSearchServiceSubscription(): void {
        this.searchService.isSearching$
            .pipe(takeUntil(this.destroy$))
            .subscribe(isSearching => {
                this.isSearching.set(isSearching);
            });
    }

    private handleKeyDown(event: KeyboardEvent): void {
        switch (event.key) {
            case 'Escape':
                this.clearSearch();
                this.searchInput.nativeElement.blur();
                break;
            case 'Enter':
                event.preventDefault();
                const query = this.searchInput.nativeElement.value.trim();
                if (query) {
                    this.search.emit(query);
                    this.searchService.search(query);
                }
                break;
        }
    }

    protected clearSearch(): void {
        this.searchInput.nativeElement.value = '';
        this.searchQuery.set('');
        this.clear.emit();
        this.searchService.clearSearch();
        this.focusInput();
    }

    protected focusInput(): void {
        this.searchInput.nativeElement.focus();
    }

    protected onInputChange(event: Event): void {
        const target = event.target as HTMLInputElement;
        this.searchQuery.set(target.value);
    }

    // Public methods for external control
    public setValue(value: string): void {
        this.searchInput.nativeElement.value = value;
        this.searchQuery.set(value);
    }

    public getValue(): string {
        return this.searchInput.nativeElement.value;
    }


}