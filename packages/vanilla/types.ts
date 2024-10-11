import type { IVirtualListOptions } from 'virtual-list-core';

export interface IVirtualListVanillaOptions<T> extends IVirtualListOptions<T> {
  containerClass?: string;
  itemClass?: string;
  clientClass?: string;
  stickyHeaderClass?: string;
  stickyFooterClass?: string;
  headerClass?: string;
  footerClass?: string;
  bodyClass?: string;
  bodyContainerClass?: string;

  customRender?: (data: T) => string;
}
