import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-solid-svg-icons/faHeart'
import { faDownload } from '@fortawesome/free-solid-svg-icons'

const ImageCard = ({image, isLiked, onLike, onSelect}) => {
  return (
    <div className='image-card' onClick={() => onSelect(image)}>
      <div className="poster">
        <img src={image.urls.small} loading='lazy' alt={image.alt_description} />
        
        <div className="img-content">
          <h3>{image.user.name}</h3>
          <button 
            className={isLiked ? "liked-heart" : ""}
            onClick={(e) => {
            e.stopPropagation() 
            onLike(image)
            }}><FontAwesomeIcon icon={faHeart} />
          </button>
          <a href={image.links.download_location} target="_blank" rel="noreferrer" className='download-btn ' download><FontAwesomeIcon icon={faDownload} />Download </a>
        </div>
      </div>
    </div>
  )
}

export default ImageCard