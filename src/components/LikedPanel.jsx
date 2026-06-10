import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

const LikedPanel = ({images, onRemove, onSelect}) => {
  return (
    <div className="liked-panel-container">
      <header className="liked-panel-header">
        <h3>Liked Images</h3>
        <p>{images.length} saved</p>
      </header>

      {images.length === 0 ? (
        <div className="empty-state">
          <p>No saved images yet</p> 
        </div>
        ) : (
          <div className="liked-grid">
            {images.map((image) => {
              return (
                <div className="saved-thumb" key={image.id} onClick={() => onSelect(image)}>
                  <img src={image.urls.small} alt={image.alt_description} />

                  <button className='remove-btn' onClick={(e) => {e.stopPropagation()
                                                  onRemove(image.id)}}>
                    <FontAwesomeIcon icon={faXmark} />
                  </button>
                </div>
              )
            })
            }
          </div>
        )
      }
    </div>

  )
}

export default LikedPanel