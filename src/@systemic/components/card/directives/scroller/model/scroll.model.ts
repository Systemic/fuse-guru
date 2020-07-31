export interface IScrollElement {
  _el: any;
  _height: any;
  _width: any;
}

export class ScrollElement implements IScrollElement {
  _el: any;
  _height: any;
  _width: any;
  constructor(el: any, height: any = undefined, width: any = undefined) {
    this._el = el;
    this._height = height
      ? height
      : this._el
      ? parseInt(window.getComputedStyle(this._el)['height'], null)
      : 0;
    this._width = width
      ? width
      : this._el
      ? parseInt(window.getComputedStyle(this._el)['width'], null)
      : 0;
  }
}

export class CardSchema extends ScrollElement {
  constructor(el: any, parent: any, grandParent: any) {
    super(el);

    this.header = new ScrollElement(el.querySelector('#CardHeaderGuru'));
    this.body = new ScrollElement(el.querySelector('#CardBodyGuru'));
    this.footer = new ScrollElement(el.querySelector('#CardFooterGuru'));

    this.parent = new ScrollElement(parent);
    this.grandParent = new ScrollElement(grandParent);
  }
  parent: IScrollElement;
  grandParent: IScrollElement;
  header: IScrollElement;
  body: IScrollElement;
  footer: IScrollElement;
}

export class PrimeTableSchema extends ScrollElement {
  constructor(el: any, parent: any, grandParent: any) {
    super(el);

    this.parent = new ScrollElement(parent);
    this.grandParent = new ScrollElement(grandParent);

    this.header = new ScrollElement(el.querySelector('.ui-table-scrollable-header-box'));
    this.body = new ScrollElement(el.querySelector('.ui-table-scrollable-body'));
    this.footer = new ScrollElement(el.querySelector('.ui-table-scrollable-footer-box'));
  }
  parent: IScrollElement;
  grandParent: IScrollElement;
  header: IScrollElement;
  body: IScrollElement;
  footer: IScrollElement;
}
