import { createVirtualLst } from 'virtual-list-apathia';
import { getList, ListItem } from './common';
import './index.css';

const rootEl = document.querySelector<HTMLDivElement>('#app')!;
rootEl.innerHTML = `<div class="virt-list__container"></div>`;

createVirtualLst<ListItem>({
  containerClass: 'virt-list__container',
  itemClass: 'virt-list__item',
  list: getList(1000),
  itemKey: 'id',
  buffer: 2,
  customRender: (data: ListItem) => {
    return `
      <div data-id="${data.id}" style=" border: 1px solid #fff; padding: 10px;display: flex; flex-direction: column; gap: 5px">
        <div style="background: red;">${data.index}</div>
        <div>${data.text}</div>
      </div>
    `.trim();
  },
});
