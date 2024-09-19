import { useEffect, useState } from 'react';
import './App.css';
import { VirtualList } from 'virtual-list-react';
import { getList } from './utils';

const Content = (props: {
  itemData: {
    id?: string;
    text?: string;
  };
  index: number;
}) => {
  const { itemData } = props;

  return (
    <div className="row-item">
      <div
        style={{
          width: '200px',
          minHeight: '44px',
          padding: '4px',
          overflow: 'hidden',
        }}
      >
        {itemData.id}
      </div>
      <div
        style={{
          flex: 1,
          alignItems: 'center',
          minHeight: '44px',
          borderLeft: '1px solid #ccc',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            padding: '6px 10px',
          }}
        >
          {itemData.text}
        </div>
      </div>
    </div>
  );
};

function App() {
  const [list, setList] = useState<any[]>([]);
  useEffect(() => {
    const data = getList(1000);
    setList(data);
  }, []);
  return (
    <>
      <div className="demo-editable">
        <VirtualList
          list={list}
          itemKey="id"
          minSize={20}
          content={(item, index) => <Content itemData={item} index={index} />}
        ></VirtualList>
      </div>
    </>
  );
}

export default App;
