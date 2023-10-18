import React, { useState, useEffect, useRef, useMemo } from 'react';
import './PlayerImage.css';
import { ImagePlayerData, Player } from '../../UserDomain';

type Props = {
  user: Player
  setUser: (user: Player) => void
};

const PlayerImage: React.FC<Props> = ({ user, setUser }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState(user.image.url);
  const [xDesloc, setXDesloc] = useState(user.image.xDesloc)
  const [yDesloc, setYDesloc] = useState(user.image.yDesloc)
  const [scale, setScale] = useState(user.image.scale)
  const [defaultValues, setDefaultValues] = useState<ImagePlayerData>()
  const root = document.documentElement;
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setImageUrl(user.image.url);
    setXDesloc(user.image.xDesloc)
    setYDesloc(user.image.yDesloc)
    setScale(user.image.scale)
  }, [user.image.scale, user.image.url, user.image.xDesloc, user.image.yDesloc])

  const trueScale = useMemo(()=>{
    return scale*10
  }, [scale])

  const handleImageClick = () => {
    setIsModalOpen(true);
    setDefaultValues(user.image)
  };

  useEffect(()=> {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if(defaultValues) {
          setXDesloc(defaultValues.xDesloc)
          setYDesloc(defaultValues.yDesloc)
          setScale(defaultValues.scale)
          setImageUrl(defaultValues.url)
        }
        setIsModalOpen(false)
      }
    };

    if(isModalOpen && modalRef.current){
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.removeEventListener('keydown', handleKeyDown);
    }
  }, [defaultValues, isModalOpen])

  useEffect(() => {
    root.style.setProperty('--player-image-x-desloc', -xDesloc+'%');
  }, [root.style, xDesloc])

  useEffect(() => {
    root.style.setProperty('--player-image-y-desloc', -yDesloc+'%');
  }, [root.style, yDesloc])

  useEffect(() => {
    root.style.setProperty('--player-image-scale', scale.toString());
  }, [root.style, scale])

  const handleXDesloc = (event: React.ChangeEvent<HTMLInputElement>) => {
    setXDesloc(Number(event.target.value));
  }

  const handleYDesloc = (event: React.ChangeEvent<HTMLInputElement>) => {
    setYDesloc(Number(event.target.value));
  }

  const handleScale = (event: React.ChangeEvent<HTMLInputElement>) => {
    setScale(Number(event.target.value)/10);
  }

  const handleImageUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(event.target.value);
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setUser({
      ...user, image: {
        url: imageUrl,
        xDesloc: xDesloc,
        yDesloc: yDesloc,
        scale: scale
      }
    })
    setIsModalOpen(false)
  };

  const handleFormCancel = () => {
    if(defaultValues) {
      setXDesloc(defaultValues.xDesloc)
      setYDesloc(defaultValues.yDesloc)
      setScale(defaultValues.scale)
      setImageUrl(defaultValues.url)
    }
    setIsModalOpen(false)
  }

  const handlePrimaryColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUser({...user, primaryColor: event.target.value})
  }

  return (
    <div className="image-container">
      <div className="image" onClick={handleImageClick}>
        <img src={imageUrl} />
      </div>
      {isModalOpen && (
        <div ref={modalRef} className="modal">
          <div className="modal-content">
            <form onSubmit={handleFormSubmit}>
              <label htmlFor="imageUrl">Image URL:</label>
              <input type="text" id="imageUrl" value={imageUrl} onChange={handleImageUrlChange} />
              <div className="button-container">
                <button type="submit">Save</button>
                <button onClick={handleFormCancel}>Close</button>
              </div>
              <input onChange={handleXDesloc} value={xDesloc} type="range" min="-50" max="50" className="slider"/>
              <input onChange={handleYDesloc} value={yDesloc} type="range" min="-50" max="50" className="slider"/>
              <input onChange={handleScale} value={trueScale} type="range" min="10" max="100" className="slider"/>
              <input onChange={handlePrimaryColorChange} value={user.primaryColor} type="color"/>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerImage;