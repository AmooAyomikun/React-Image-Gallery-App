import React from 'react'
import ImageCard from './ImageCard'
import SkeletonCard from './SkeletonCard'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGrip } from '@fortawesome/free-solid-svg-icons'
import { faList } from '@fortawesome/free-solid-svg-icons'

const ImageGrid = ({images, likedIds, onLike, onSelect, sentinelRef, loading, query, totalResults, viewMode, setViewMode}) => {
  return (
    <div>
      <div className='result-row'>
        <h2>Showing {images.length} of {totalResults} result for "{query}"</h2>

        <div className='view-toggle'>
          <FontAwesomeIcon className={viewMode === 'grid' ? "active-view" : ""} onClick={() => setViewMode("grid")} icon={faGrip} />
          <FontAwesomeIcon className={viewMode === 'list' ? "active-view" : ""} onClick={() => setViewMode("list")} icon={faList} />
        </div>
      </div>

      {images.length === 0 && !loading ? 
        <p>No image match your filter and search.</p>
        : <div className={viewMode === "grid" ? "image-grid" : "image-list"}>
          {
            images.map((image) => {
              return <ImageCard
                key={image.id}
                image={image}
                isLiked={likedIds.includes(image.id)}
                onLike={onLike}
                onSelect={onSelect}
              />
            })
          }
        </div>
      }

      {loading && images.length === 0 &&
        Array.from({length:8}).map((_,index) => (
          <SkeletonCard key={index}/>
        ))
      }
    
      <div ref={sentinelRef}></div>
    </div>
  )
}

export default ImageGrid