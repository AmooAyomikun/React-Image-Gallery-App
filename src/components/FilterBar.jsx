import React from 'react'

const FilterBar = ({category, orientation, onCategoryChange, onOrientationChange}) => {
  const categoryOptions = ["All", "Nature", "Architecture", "People", "Travel"]
  const orientationOptions = ["All", "Landscape", "Portrait", "Squarish"]

  return (
    <div className='filter-bar'>
      {categoryOptions.map((option) => {
        return <button
                    key={option}
                    className={option === category ? "category active" : "category"}
                    onClick={() => onCategoryChange(option)}
                      >{option}</button>
      })} 
      
      | 

      {orientationOptions.map((option) => {
        return <button
                    key={option}
                    className={option === orientation ? "orientation active" : "orientation"}
                    onClick={() => onOrientationChange(option)}
                    >{option}</button>
      })}
    </div>
  )
}

export default FilterBar