import { VirtualList } from 'virtual-list-core';
import { IVirtualListVanillaOptions } from './types';
import { convertStringToDom } from './utils';

export class VirtualListNode<T extends { id: string; text: string }> {
  private _rootEl: HTMLElement | null = null;
  private _renderBegin = -1;
  private _renderEnd = -1;

  private _itemClassName = 'virt-list__item';
  private _customRender?: (listItem: T) => string;
  private _virtIns: VirtualList<T> | null = null;

  constructor(
    root: HTMLElement,
    options: IVirtualListVanillaOptions<T>,
    virtIns: VirtualList<T>,
  ) {
    this._rootEl = root;
    this._itemClassName = options.itemClass || 'virt-list__item';
    this._customRender = options.customRender;
    this._virtIns = virtIns;
  }

  createNode(listItem: T) {
    const targetItem = document.createElement('div');
    targetItem.dataset.id = listItem.id;
    targetItem.className = this._itemClassName;
    if (this._customRender) {
      targetItem.appendChild(convertStringToDom(this._customRender(listItem)));
    } else {
      targetItem.textContent = listItem.text;
    }
    return targetItem;
  }

  _getRootElementId() {
    if (!this._rootEl) {
      console.error('rootEl is required');
      return;
    }
    const childrenNodeArr = Array.from(this._rootEl.children) as HTMLElement[];
    const childrenId = childrenNodeArr.map((item) => item.dataset.id);
    return childrenId;
  }

  // 从两端出发找到需要更新节点的 index

  renderNode(
    itemList: T[],
    renderRange: { renderBegin: number; renderEnd: number },
  ) {
    const { renderBegin, renderEnd } = renderRange;
    if (
      this._renderBegin === -1 ||
      this._renderEnd === -1 ||
      this._renderBegin > renderEnd ||
      this._renderEnd < renderBegin
    ) {
      // 初始化时更新
      this._virtIns?.dispatchObservers(false);
      for (let i = 0; i < itemList.length; i++) {
        const node = this.createNode(itemList[i]);
        this._rootEl?.appendChild(node);
        this._virtIns?.observerEl(node);
      }
    } else if (renderBegin < this._renderBegin && renderEnd > this._renderEnd) {
      for (let i = renderBegin; i < this._renderBegin; i++) {
        this._virtIns?.unObserverEl(this._rootEl?.firstChild as HTMLElement);
        this._rootEl?.removeChild(this._rootEl.firstChild as HTMLElement);
      }
      for (let i = this._renderEnd + 1; i <= renderEnd; i++) {
        this._rootEl?.appendChild(this.createNode(itemList[i]));
      }
    } else if (
      renderBegin <= this._renderBegin &&
      renderEnd < this._renderEnd
    ) {
      for (
        let i = renderBegin, j = this._renderBegin - renderBegin - 1;
        i < this._renderBegin && j >= 0;
        i++, j--
      ) {
        const node = this.createNode(itemList[j]);
        this._rootEl?.prepend(node);
        this._virtIns?.observerEl(node);
      }

      for (let i = this._renderEnd; i > renderEnd; i--) {
        this._virtIns?.unObserverEl(this._rootEl?.lastChild as HTMLElement);
        this._rootEl?.removeChild(this._rootEl.lastChild as HTMLElement);
      }
    } else if (
      renderBegin > this._renderBegin &&
      renderEnd >= this._renderEnd
    ) {
      for (let i = this._renderBegin; i < renderBegin; i++) {
        this._virtIns?.unObserverEl(this._rootEl?.firstChild as HTMLElement);
        this._rootEl?.removeChild(this._rootEl.firstChild as HTMLElement);
      }
      for (let i = this._renderEnd, j = 0; i < renderEnd; i++, j++) {
        const node = this.createNode(
          itemList[this._renderEnd - renderBegin - 1 + j],
        );
        this._virtIns?.observerEl(node);
        this._rootEl?.appendChild(node);
      }
    }

    this._renderBegin = renderBegin;
    this._renderEnd = renderEnd;
  }
}
