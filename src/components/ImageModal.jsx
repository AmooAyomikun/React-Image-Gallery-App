import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-solid-svg-icons'
import { faXmark } from '@fortawesome/free-solid-svg-icons/faXmark'
import { faEye } from '@fortawesome/free-solid-svg-icons'
import { faDownload } from '@fortawesome/free-solid-svg-icons'

const ImageModal = ({ image, isLiked, onLike, onClose, onPrev, onNext, currentIndex, total }) => {
  if (!image) return null

  const [detailedStats, setDetailedStats] = useState({
    downloads: image.downloads || 0,
    views: image.views || 0
  })

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowLeft') onPrev()
      if (event.key === 'ArrowRight') onNext()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onClose, onPrev, onNext])

  useEffect(() => {
    async function fetchExtendedStats() {
      try {
        const apiKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY
        const response = await fetch(`https://api.unsplash.com/photos/${image.id}`, {
          headers: {
            Authorization: `Client-ID ${apiKey}`
          }
        })
        if (response.ok) {
          const data = await response.json()
          setDetailedStats({
            downloads: data.downloads || 0,
            views: data.views || 0
          })
        }
      } catch (error) {
        console.error("Error fetching detailed photo stats:", error)
      }
    }

    fetchExtendedStats()
  }, [image.id]) 

  return (
    <div className='image-modal' onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="modal-close">
          <FontAwesomeIcon icon={faXmark} />
        </button>

        <div className="image-poster">
          {image.urls?.regular ? (
            <img src={image.urls.regular} alt={image.alt_description} />
          ) : (
            <div className="poster-placeholder">
              <span>No Image Available</span>
            </div>
          )}
        </div>

        <div className="modal-content">  
          <div className="navigation-row">
            <button onClick={onPrev} disabled={currentIndex <= 0}>Prev</button>
            <button onClick={onNext}>Next</button>
            <h3>
              {currentIndex === -1 ? "Saved Item" : `${currentIndex + 1} / ${total}`}
            </h3>
          </div>

          <div className="modal-info">
            <p className="image-desc">{image.description || image.alt_description || "Untitled Image"}</p>
            <h3 className="author-name">By {image.user?.name || "Unknown"}</h3>

            <div className="stat-row">
              <span className="stat-item" onClick={(e) => {
                e.stopPropagation() 
                onLike(image)
              }}>
                <FontAwesomeIcon icon={faHeart} className={isLiked ? "liked-heart" : ""} /> {image.likes || 0}
              </span>

              <span className="stat-item">
                <FontAwesomeIcon icon={faDownload} /> {detailedStats.downloads.toLocaleString()}
              </span>
              <span className="stat-item">
                <FontAwesomeIcon icon={faEye} /> {detailedStats.views.toLocaleString()}
              </span>
            </div>

            <div className="tags">
              {image.tags?.map((tag) => (
                <span key={tag.title} className="tag">
                  {tag.title}
                </span>
              ))}
            </div>

            <div className="action-buttons">
              <button className={isLiked ? "liked" : ""} onClick={() => onLike(image)}>
                <FontAwesomeIcon icon={faHeart} />
                {isLiked ? "Saved" : "Save to Watchlist"}
              </button>
              <a 
                href={image.links?.download} 
                target="_blank" 
                rel="noreferrer" 
                className='download-btn'
                download
              >
                <FontAwesomeIcon icon={faDownload} /> Download HD
              </a>
            </div>
          </div> 
        </div>
      </div>
    </div>
  )
}

export default ImageModal