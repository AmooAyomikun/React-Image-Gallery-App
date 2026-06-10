import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

const SearchBar = ({query, onQueryChange, onSearch}) => {
    function handleKeyDown(event){
        if(event.key === "Enter"){
            onSearch(query)
        }
    }

  return (
    <div className='search-bar'>
        <div className="search-container">
            <FontAwesomeIcon className='search-icon' icon={faSearch} />
            <input 
                type="text"
                placeholder='search for an image...'
                value={query}
                onChange={(e) => onQueryChange(e.target.value)} 
                onKeyDown={handleKeyDown}
            />
        </div>
        <button className="search-button" onClick={() => onSearch(query)}>
            Search
        </button>
    </div>
  )
}

export default SearchBar