import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import List from './List';
import Alert from './Alert';

const getLocalStorage = () =>{
  let getList = localStorage.getItem('list')
  if(getList){
    return(getList = JSON.parse(localStorage.getItem('list')))
  }else{
    return []
  } 
}

function App() {
  const [text, setText] = useState('');
  const [list, setList] = useState(getLocalStorage());
  const [alert, setAlert] = useState({ show: false, msg: '', type: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editID, setEditID] = useState(null);

  useEffect(() => {
    localStorage.setItem('list', JSON.stringify(list));
  }, [list]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text) {
      // Alert
      showAlert(true, 'Enter any value', 'danger');
    } else if (text && isEditing) {
      // edit
      setList(list.map((item)=>{
        if(item.id === editID){
          return {...item, title: text}
        } 
        return item;
      }))
      setIsEditing(false);
      setEditID(null);
      setText('');
      showAlert(true, 'item has been edited', 'success')
    } else {
      // showAlert(true,'Item add', 'success')
      const newItem = { id: uuidv4(), title: text };
      setList([...list, newItem]);
      setText('');
    }
  };

  const showAlert = (show = false, msg = '', type = '') => {
    setAlert({ show, msg, type });
  };

  const editItem = (id) => {
    const specificItem = list.find((item) => item.id === id);
    setIsEditing(true);
    setEditID(id);
    setText(specificItem.title);
  };

  const deleteItem = (id) => {
    setList(list.filter((item) => item.id !== id));
    showAlert(true, 'item has been deleted', 'danger');
  };

  const handleClear = () => {
    setList([]);
    showAlert(true, 'all item deleted' , 'danger')
  };
  return (
    <>
      <section className="section-center">
        <form className="grocery-form" onSubmit={handleSubmit}>
          {alert.show && (
            <Alert {...alert} removeAlert={showAlert} list={list} />
          )}

          <h3>Grocery Bucket List</h3>
          <div className="form-control">
            <input
              type="text"
              value={text}
              className="grocery"
              placeholder="Eg:Oil"
              onChange={(e) => setText(e.target.value)}
            />
            <button type="submit" className="submit-btn">
              {isEditing ? 'Edit' : 'Submit'}
            </button>
          </div>
        </form>
        {list.length > 0 && (
          <div className="grocery-container">
            <List items={list} deleteItem={deleteItem} editItem={editItem} />
            <button type="button" className="clear-btn" onClick={handleClear}>
              Clear all
            </button>
          </div>
        )}
      </section>
    </>
  );
}

export default App;
