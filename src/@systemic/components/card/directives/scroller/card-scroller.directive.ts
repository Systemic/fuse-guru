import {
    AfterViewInit,
    Directive,
    ElementRef,
    HostListener,
    Input,
    OnDestroy,
    OnInit
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Platform } from '@angular/cdk/platform';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime, filter, takeUntil } from 'rxjs/operators';
import PerfectScrollbar from 'perfect-scrollbar';
import * as _ from 'lodash';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

interface IGuruScrollableCardOptions extends PerfectScrollbar.Options {
    enableScroller?: boolean;
    updateOnRouteChange: boolean;
}
@UntilDestroy()
@Directive({
    // tslint:disable-next-line: directive-selector
    selector: 'guru-content'
})
// tslint:disable-next-line: directive-class-suffix
export class GuruCardScrollerDirective implements OnInit, AfterViewInit, OnDestroy {
    isInitialized: boolean;
    isMobile: boolean;
    ps: PerfectScrollbar | any;

    // Private
    private _animation: number | null;
    private _enabled: boolean | '';
    private _debouncedUpdate: any;
    private _options: IGuruScrollableCardOptions;
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     *  {Platform} _platform
     *  {Router} _router
     */
    constructor(
        public elementRef: ElementRef,
        private _platform: Platform,
        private _router: Router
    ) {
        // Set the defaults
        this.isInitialized = false;
        this.isMobile = false;

        // Set the private defaults
        this._animation = null;
        this._enabled = false;
        this._debouncedUpdate = _.debounce(this.update, 150);
        this._options = {
            updateOnRouteChange: true,
            enableScroller: false,
            suppressScrollX: true
        };
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Perfect Scrollbar options
     *
     *  value
     */
    @Input()
    set options(value: IGuruScrollableCardOptions) {
        // Merge the options
        this._options = _.merge({}, this._options, value);

        // Destroy and re-init the PerfectScrollbar to update its options
        setTimeout(() => {
            this._destroy();
        });

        if (this.options.enableScroller) {
            setTimeout(() => {
                this._init();
            });
        }
    }

    get options(): IGuruScrollableCardOptions {
        // Return the options
        return this._options;
    }

    /**
     * Is enabled
     *
     *  {boolean | ""} value
     */
    set enabled(value: boolean | '') {
        // If nothing is provided with the directive (empty string),
        // we will take that as a true
        if (value === '') {
            value = true;
        }

        // Return, if both values are the same
        if (this.enabled === value) {
            return;
        }

        // Store the value
        this._enabled = value;

        // If enabled...
        if (this.enabled && this.options.enableScroller) {
            // Init the directive
            setTimeout(() => {
                this._init();
            });
        } else {
            // Otherwise destroy it
            this._destroy();
        }
    }

    get enabled(): boolean | '' {
        // Return the enabled status
        return this._enabled;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Subscribe to window resize event
        fromEvent(window, 'resize')
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(150)
            )
            .pipe(untilDestroyed(this))
            .subscribe(() => {
                // Update the PerfectScrollbar
                this.update();
            });
    }

    /**
     * After view init
     */
    ngAfterViewInit(): void {
        // Check if scrollbars enabled or not from the main config
        this.enabled = true;

        // Scroll to the top on every route change
        if (this.options.updateOnRouteChange) {
            this._router.events
                .pipe(
                    takeUntil(this._unsubscribeAll),
                    filter(event => event instanceof NavigationEnd)
                )
                .pipe(untilDestroyed(this))
                .subscribe(() => {
                    setTimeout(() => {
                        this.scrollToTop();
                        this.update();
                    }, 0);
                });
        }
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        this._destroy();

        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Initialize
     *
     */
    _init(): void {
        // Return, if already initialized
        if (this.isInitialized) {
            return;
        }

        // Check if is mobile
        if (this._platform.ANDROID || this._platform.IOS) {
            this.isMobile = true;
        }

        // Return if it's mobile
        if (this.isMobile) {
            // Return...
            return;
        }

        // Set as initialized
        this.isInitialized = true;

        // Initialize the perfect-scrollbar
        this.ps = new PerfectScrollbar(this.elementRef.nativeElement, {
            ...this._options
        });
        // Unbind 'keydown' events of PerfectScrollbar since it causes an extremely
        // high CPU usage on Angular Material inputs.
        // Loop through all the event elements of this PerfectScrollbar instance
        this.ps.event.eventElements.forEach((eventElement: any) => {
            // If we hit to the element with a 'keydown' event...
            if (typeof eventElement.handlers['keydown'] !== 'undefined') {
                // Unbind it
                eventElement.element.removeEventListener(
                    'keydown',
                    eventElement.handlers['keydown'][0]
                );
            }
        });
    }

    /**
     * Destroy
     *
     */
    _destroy(): void {
        if (!this.isInitialized || !this.ps) {
            return;
        }

        // Destroy the perfect-scrollbar
        this.ps.destroy();

        // Clean up
        this.ps = null;
        this.isInitialized = false;
    }

    /**
     * Update scrollbars on window resize
     *
     */
    @HostListener('window:resize')
    _updateOnResize(): void {
        this._debouncedUpdate();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Document click
     *
     *  {Event} event
     */
    @HostListener('document:click', ['$event'])
    documentClick(event: Event): void {
        if (!this.isInitialized || !this.ps) {
            return;
        }

        // Update the scrollbar on document click..
        // This isn't the most elegant solution but there is no other way
        // of knowing when the contents of the scrollable container changes.
        // Therefore, we update scrollbars on every document click.
        this.ps.update();
    }

    /**
     * Update the scrollbar
     */
    public update(): void {
        if (!this.isInitialized) {
            return;
        }

        // Update the perfect-scrollbar
        this.ps.update();
    }

    /**
     * Destroy the scrollbar
     */
    destroy(): void {
        this.ngOnDestroy();
    }

    /**
     * Returns the geometry of the scrollable element
     *
     *  prefix
     */
    geometry(prefix: string = 'scroll'): CardScrollerGuruGeometry {
        console.log({
            Left: this.elementRef.nativeElement[prefix + 'Left'],
            Top: this.elementRef.nativeElement[prefix + 'Top'],
            Width: this.elementRef.nativeElement[prefix + 'Width'],
            Height: this.elementRef.nativeElement[prefix + 'Height']
        });
        return new CardScrollerGuruGeometry(
            this.elementRef.nativeElement[prefix + 'Left'],
            this.elementRef.nativeElement[prefix + 'Top'],
            this.elementRef.nativeElement[prefix + 'Width'],
            this.elementRef.nativeElement[prefix + 'Height']
        );
    }

    /**
     * Returns the position of the scrollable element
     *
     *  absolute
     */
    position(absolute: boolean = false): CardScrollerGuruPosition {
        if (!absolute && this.ps) {
            return new CardScrollerGuruPosition(this.ps.reach.x || 0, this.ps.reach.y || 0);
        } else {
            return new CardScrollerGuruPosition(
                this.elementRef.nativeElement.scrollLeft,
                this.elementRef.nativeElement.scrollTop
            );
        }
    }

    /**
     * Scroll to
     *
     *  x
     *  y
     *  speed
     */
    scrollTo(x: number, y?: number, speed?: number): void {
        if (y == null && speed == null) {
            this.animateScrolling('scrollTop', x, speed);
        } else {
            if (x != null) {
                this.animateScrolling('scrollLeft', x, speed);
            }

            if (y != null) {
                this.animateScrolling('scrollTop', y, speed);
            }
        }
    }

    /**
     * Scroll to X
     *
     *  {number} x
     *  {number} speed
     */
    scrollToX(x: number, speed?: number): void {
        this.animateScrolling('scrollLeft', x, speed);
    }

    /**
     * Scroll to Y
     *
     *  {number} y
     *  {number} speed
     */
    scrollToY(y: number, speed?: number): void {
        this.animateScrolling('scrollTop', y, speed);
    }

    /**
     * Scroll to top
     *
     *  {number} offset
     *  {number} speed
     */
    scrollToTop(offset?: number, speed?: number): void {
        this.animateScrolling('scrollTop', offset || 0, speed);
    }

    /**
     * Scroll to left
     *
     *  {number} offset
     *  {number} speed
     */
    scrollToLeft(offset?: number, speed?: number): void {
        this.animateScrolling('scrollLeft', offset || 0, speed);
    }

    /**
     * Scroll to right
     *
     *  {number} offset
     *  {number} speed
     */
    scrollToRight(offset?: number, speed?: number): void {
        const left =
            this.elementRef.nativeElement.scrollWidth - this.elementRef.nativeElement.clientWidth;
        this.animateScrolling('scrollLeft', left - (offset || 0), speed);
    }

    /**
     * Scroll to bottom
     *
     *  {number} offset
     *  {number} speed
     */
    scrollToBottom(offset?: number, speed?: number): void {
        const top =
            this.elementRef.nativeElement.scrollHeight - this.elementRef.nativeElement.clientHeight;
        this.animateScrolling('scrollTop', top - (offset || 0), speed);
    }

    /**
     * Scroll to element
     *
     *  qs
     *  offset
     *  speed
     */
    scrollToElement(qs: string, offset?: number, speed?: number): void {
        const element = this.elementRef.nativeElement.querySelector(qs);

        if (!element) {
            return;
        }

        const elementPos = element.getBoundingClientRect();
        const scrollerPos = this.elementRef.nativeElement.getBoundingClientRect();

        if (this.elementRef.nativeElement.classList.contains('ps--active-x')) {
            const currentPos = this.elementRef.nativeElement['scrollLeft'];
            const position = elementPos.left - scrollerPos.left + currentPos;

            this.animateScrolling('scrollLeft', position + (offset || 0), speed);
        }

        if (this.elementRef.nativeElement.classList.contains('ps--active-y')) {
            const currentPos = this.elementRef.nativeElement['scrollTop'];
            const position = elementPos.top - scrollerPos.top + currentPos;

            this.animateScrolling('scrollTop', position + (offset || 0), speed);
        }
    }

    /**
     * Animate scrolling
     *
     *  target
     *  value
     *  speed
     */
    animateScrolling(target: string, value: number, speed?: number): void {
        if (this._animation) {
            window.cancelAnimationFrame(this._animation);
            this._animation = null;
        }

        if (!speed || typeof window === 'undefined') {
            this.elementRef.nativeElement[target] = value;
        } else if (value !== this.elementRef.nativeElement[target]) {
            let newValue = 0;
            let scrollCount = 0;

            let oldTimestamp = performance.now();
            let oldValue = this.elementRef.nativeElement[target];

            const cosParameter = (oldValue - value) / 2;

            const step = (newTimestamp: number) => {
                scrollCount += Math.PI / (speed / (newTimestamp - oldTimestamp));
                newValue = Math.round(value + cosParameter + cosParameter * Math.cos(scrollCount));

                // Only continue animation if scroll position has not changed
                if (this.elementRef.nativeElement[target] === oldValue) {
                    if (scrollCount >= Math.PI) {
                        this.animateScrolling(target, value, 0);
                    } else {
                        this.elementRef.nativeElement[target] = newValue;

                        // On a zoomed out page the resulting offset may differ
                        oldValue = this.elementRef.nativeElement[target];
                        oldTimestamp = newTimestamp;

                        this._animation = window.requestAnimationFrame(step);
                    }
                }
            };

            window.requestAnimationFrame(step);
        }
    }
}

export class CardScrollerGuruGeometry {
    public x: number;
    public y: number;

    public w: number;
    public h: number;

    constructor(x: number, y: number, w: number, h: number) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
}

export class CardScrollerGuruPosition {
    public x: number | 'start' | 'end';
    public y: number | 'start' | 'end';

    constructor(x: number | 'start' | 'end', y: number | 'start' | 'end') {
        this.x = x;
        this.y = y;
    }
}
