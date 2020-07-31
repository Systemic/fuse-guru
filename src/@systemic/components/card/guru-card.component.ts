import {
    Component,
    OnInit,
    QueryList,
    AfterViewInit,
    ContentChildren,
    AfterContentInit,
    ViewEncapsulation,
    ChangeDetectionStrategy,
    ViewChild,
    ChangeDetectorRef,
    EventEmitter,
    Output,
    OnDestroy
} from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { MediaMatcher } from '@angular/cdk/layout';
import { Platform } from '@angular/cdk/platform';
import * as _ from 'lodash';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Guru } from '@systemic/helper';
import { GuruCardSidebarDirective } from './directives';

@UntilDestroy()
@Component({
    selector: 'guru-card',
    templateUrl: './guru-card.component.html',
    styleUrls: ['./guru-card.component.scss'],
    encapsulation: ViewEncapsulation.Emulated,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GuruCardComponent implements OnInit, AfterContentInit, AfterViewInit, OnDestroy {
    sidebar: {
        left?: GuruCardSidebarDirective;
        right?: GuruCardSidebarDirective;
    } = {};

    @ContentChildren(GuruCardSidebarDirective) private lstSidebarCC: QueryList<GuruCardSidebarDirective>;

    @ViewChild('MatNavLeft', { static: false }) private MatNavLeft: MatSidenav;
    @ViewChild('MatNavRight', { static: false }) private MatNavRight: MatSidenav;
    @Output() afterInit: EventEmitter<GuruCardComponent> = new EventEmitter(null);
    @Output() sidebarLeftEvent: EventEmitter<
        'open_start' | 'close_start' | 'open_end' | 'close_end'
    > = new EventEmitter();
    @Output() sidebarRightEvent: EventEmitter<
        'open_start' | 'close_start' | 'open_end' | 'close_end'
    > = new EventEmitter();
    private _isMobile = false;
    private _mobileQuery: MediaQueryList;
    private _mobileQueryListener: () => void;
    private _sidebarResponsiveCheck = _.debounce(this.sidebar_responsive_check, 150);

    _leftWidth = '';
    _rightWidth = '';
    constructor(
        private _cd: ChangeDetectorRef,
        private _platform: Platform,
        private _media: MediaMatcher
    ) { }

    ngOnInit(): void { }

    ngAfterContentInit(): void {
        this.lstSidebarCC.forEach(sidebarInstance => {
            if (sidebarInstance.position === 'left') {
                this.sidebar.left = sidebarInstance;
            } else if (sidebarInstance.position === 'right') {
                this.sidebar.right = sidebarInstance;
            }
        });
    }
    ngAfterViewInit(): void {
        setTimeout(() => {
            this.sidebarconfig();
            this.afterInit.emit(this);
        });
    }
    ngOnDestroy(): void {
        this._cd.detach(); // do this
        if (Guru.isValidObj(this._mobileQuery)) {
            // for me I was detect changes inside "subscribe" so was enough for me to just unsubscribe;
            if (this._platform.IOS) {
                // tslint:disable-next-line: deprecation
                this._mobileQuery.removeListener(this._mobileQueryListener);
            } else {
                this._mobileQuery.removeEventListener('change', this._mobileQueryListener);
            }
        }
    }
    sidebarconfig(): void {
        if (Guru.isValidObj(this.MatNavLeft)) {
            this.MatNavLeft.mode = this.sidebar.left.mode;
            this.MatNavLeft.autoFocus = this.sidebar.left.autoFocus;
            this.MatNavLeft.disableClose = this.sidebar.left.disableClose;
            this.MatNavLeft.opened = this.sidebar.left.opened;
            this._leftWidth = this.sidebar.left.width;
        }
        if (Guru.isValidObj(this.MatNavRight)) {
            this.MatNavRight.mode = this.sidebar.right.mode;
            this.MatNavRight.autoFocus = this.sidebar.right.autoFocus;
            this.MatNavRight.disableClose = this.sidebar.right.disableClose;
            this.MatNavRight.opened = this.sidebar.right.opened;
            this._rightWidth = this.sidebar.right.width;
        }

        this._isMobile = this._platform.ANDROID || this._platform.IOS;
        this._mobileQuery = this._media.matchMedia('(max-width: 600px)');
        if (!this._cd['destroyed']) {
            this._mobileQueryListener = () => this._cd.detectChanges();
            if (this._platform.IOS) {
                // tslint:disable-next-line: deprecation
                this._mobileQuery.addListener(this._mobileQueryListener);
            } else {
                this._mobileQuery.addEventListener('change', this._mobileQueryListener);
            }

        }

        this._mobileQuery.onchange = () => {
            this._sidebarResponsiveCheck();
        };

        this._sidebarResponsiveCheck();
        this.sidebar_event_bind();
    }

    private sidebar_responsive_check(): void {
        if (this._mobileQuery.matches || this._isMobile) {
            if (Guru.isValidObj(this.sidebar.left) && this.sidebar.left.responsive) {
                this.MatNavLeft.mode = 'over';
                this.MatNavLeft.opened = false;
            }
            if (Guru.isValidObj(this.sidebar.right) && this.sidebar.right.responsive) {
                this.MatNavRight.mode = 'over';
                this.MatNavRight.opened = false;
            }
        } else if (!this._mobileQuery.matches) {
            if (Guru.isValidObj(this.sidebar.left) && this.sidebar.left.responsive) {
                this.MatNavLeft.mode = this.sidebar.left.mode;
                this.MatNavLeft.opened = this.sidebar.left.opened;
            }
            if (Guru.isValidObj(this.sidebar.right) && this.sidebar.right.responsive) {
                this.MatNavRight.mode = this.sidebar.right.mode;
                this.MatNavRight.opened = this.sidebar.right.opened;
            }
        }
    }
    private sidebar_event_bind(): void {
        if (Guru.isValidObj(this.MatNavLeft)) {
            this.MatNavLeft.openedChange.pipe(untilDestroyed(this)).subscribe(data => {
                this.sidebarLeftEvent.next(data ? 'open_end' : 'close_end');
            });
            this.MatNavLeft.openedStart.pipe(untilDestroyed(this)).subscribe(() => {
                this.sidebarLeftEvent.next('open_start');
            });
            this.MatNavLeft.closedStart.pipe(untilDestroyed(this)).subscribe(() => {
                this.sidebarLeftEvent.next('close_start');
            });
        }
        if (Guru.isValidObj(this.MatNavRight)) {
            this.MatNavRight.openedChange.pipe(untilDestroyed(this)).subscribe(data => {
                this.sidebarRightEvent.next(data ? 'open_end' : 'close_end');
            });
            this.MatNavRight.openedStart.pipe(untilDestroyed(this)).subscribe(() => {
                this.sidebarRightEvent.next('open_start');
            });
            this.MatNavRight.closedStart.pipe(untilDestroyed(this)).subscribe(() => {
                this.sidebarRightEvent.next('close_start');
            });
        }
    }
    sidebar_left(action: 'open' | 'close' | 'toggle'): void {
        this._sidebar_action(this.MatNavLeft, action);
    }
    sidebar_right(action: 'open' | 'close' | 'toggle'): void {
        this._sidebar_action(this.MatNavRight, action);
    }

    private _sidebar_action(nav: MatSidenav, action: 'open' | 'close' | 'toggle'): void {
        // OPEN SIDEBAR
        if (action === 'open') {
            nav.open();
            this._cd.markForCheck();
        }
        // CLOSE SIDEBAR
        if (action === 'close') {
            nav.close();
            this._cd.markForCheck();
        }
        // TOGGLE SIDEBAR
        if (action === 'toggle') {
            nav.toggle();
            this._cd.markForCheck();
        }
    }
}
