import React, { useState } from 'react';
import './ImageOfItem.css'

export type Item = { imageUrl: string }

type Props = {
  items: Item[]
  setItems: React.Dispatch<React.SetStateAction<Item[]>>
  itemIndex: number
  style?: React.CSSProperties
};

const ImageOfItem: React.FC<Props> = ({ setItems, items, itemIndex, style }) => {
  const [imageModal, setImageModal] = useState(false)
  const [newUrl, setNewUrl] = useState('')

  const updateUrl = () => {
    setItems(prevItems => {
      const newItems = [...prevItems];
      newItems[itemIndex].imageUrl = newUrl;
      return newItems;
    })
    setImageModal(false)
  }

  const handleImageClick = () => {
    setImageModal(true)
    setNewUrl(items[itemIndex].imageUrl)
  };

  return (
    <>
      <div className='image-holder' style={style}>
        {!items[itemIndex].imageUrl ?
          <i onClick={handleImageClick} className="fa-solid fa-image"/>
          :
          <img onClick={handleImageClick} src={items[itemIndex].imageUrl}/>
        }
      </div>
      {imageModal &&
        <div className="modal">
          <div className="modal-content">
            <label htmlFor="imageUrl">Image URL:</label>
            <input type="text" id="imageUrl" value={newUrl} onChange={(event)=>setNewUrl(event.target.value)}  />
            <div className="button-container">
              <button onClick={()=>setImageModal(false)}>Close</button>
              <button onClick={()=>updateUrl()} type="submit">Save</button>
            </div>
          </div>
        </div>
      }
    </>
  );
};

export default ImageOfItem;