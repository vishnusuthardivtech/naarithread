import { useEffect, useState } from 'react'
import { useApp } from '../context/AppContext'

const colorOptions = ['Red', 'Pink', 'Green', 'Gold', 'Black']
const categoryOptions = ['Lehenga', 'Mirror Work', 'Bridal', 'Party Wear']
const formatRupees = (value) => `\u20B9${Number(value).toLocaleString('en-IN')}`

export default function FilterDrawer({ open, onOpen, onClose, listingKey }) {
  const {
    defaultFilters,
    minFilterPrice,
    maxFilterPrice,
    getListingFilters,
    applyListingFilters,
    resetListingFilters,
  } = useApp()

  const activeFilters = getListingFilters(listingKey)
  const [draftFilters, setDraftFilters] = useState(activeFilters)

  useEffect(() => {
    setDraftFilters(activeFilters)
  }, [activeFilters, open])

  const toggleMultiSelect = (field, value) => {
    setDraftFilters((current) => {
      const values = current[field].includes(value)
        ? current[field].filter((item) => item !== value)
        : [...current[field], value]

      return {
        ...current,
        [field]: values,
      }
    })
  }

  const handlePriceChange = (field, nextValue) => {
    setDraftFilters((current) => {
      const numericValue = Number(nextValue)
      const nextFilters = {
        ...current,
        [field]: numericValue,
      }

      if (field === 'priceMin' && numericValue > current.priceMax) {
        nextFilters.priceMax = numericValue
      }

      if (field === 'priceMax' && numericValue < current.priceMin) {
        nextFilters.priceMin = numericValue
      }

      applyListingFilters(listingKey, nextFilters)
      return nextFilters
    })
  }

  const activeCount = [
    activeFilters.availability ? 1 : 0,
    activeFilters.priceMin !== minFilterPrice || activeFilters.priceMax !== maxFilterPrice ? 1 : 0,
    activeFilters.colors.length,
    activeFilters.categories.length,
  ].reduce((total, value) => total + value, 0)

  return (
    <>
      <div className="filter-topbar">
        <button id="openFilter" className="filter-open-btn" onClick={onOpen}>
          Filter{activeCount ? ` (${activeCount})` : ''}
        </button>
      </div>

      <div className={`filter-backdrop${open ? ' active' : ''}`} onClick={onClose}></div>

      <div className={`filter-drawer${open ? ' active' : ''}`} id="filterDrawer">
        <div className="filter-header">
          <div>
            <h4>Filter</h4>
            <p>Refine your selection</p>
          </div>
          <button id="closeFilter" className="filter-close-btn" onClick={onClose}>X</button>
        </div>

        <div className="filter-content">
          <div className="filter-group">
            <h5>Availability</h5>
            <label className="filter-option">
              <input
                type="checkbox"
                checked={draftFilters.availability}
                onChange={(event) => setDraftFilters((current) => ({ ...current, availability: event.target.checked }))}
              />
              <span>In Stock</span>
            </label>
          </div>

          <div className="filter-group">
            <h5>Price</h5>
            <div className="price-slider-summary">
              <span>{formatRupees(draftFilters.priceMin)}</span>
              <span>{formatRupees(draftFilters.priceMax)}</span>
            </div>
            <div className="price-slider-wrap">
              <input
                type="range"
                min={minFilterPrice}
                max={maxFilterPrice}
                value={draftFilters.priceMin}
                onChange={(event) => handlePriceChange('priceMin', event.target.value)}
              />
              <input
                type="range"
                min={minFilterPrice}
                max={maxFilterPrice}
                value={draftFilters.priceMax}
                onChange={(event) => handlePriceChange('priceMax', event.target.value)}
              />
            </div>
            <div className="price-values">
              <span>{`Min Price: ${formatRupees(draftFilters.priceMin)}`}</span>
              <span>{`Max Price: ${formatRupees(draftFilters.priceMax)}`}</span>
            </div>
          </div>

          <div className="filter-group">
            <h5>Color</h5>
            <div className="filter-colors">
              {colorOptions.map((color) => (
                <button
                  type="button"
                  key={color}
                  className={`color-swatch${draftFilters.colors.includes(color) ? ' active' : ''}`}
                  onClick={() => toggleMultiSelect('colors', color)}
                >
                  <span className={`color-dot ${color.toLowerCase()}`}></span>
                  <span>{color}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <h5>Category</h5>
            <div className="filter-stack">
              {categoryOptions.map((category) => (
                <label className="filter-option" key={category}>
                  <input
                    type="checkbox"
                    checked={draftFilters.categories.includes(category)}
                    onChange={() => toggleMultiSelect('categories', category)}
                  />
                  <span>{category}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="filter-footer">
          <button
            type="button"
            className="reset-filter-btn"
            onClick={() => {
              setDraftFilters(defaultFilters)
              resetListingFilters(listingKey)
            }}
          >
            Reset Filters
          </button>
          <button
            id="applyFilter"
            type="button"
            className="apply-filter-btn"
            onClick={() => {
              applyListingFilters(listingKey, draftFilters)
              onClose()
            }}
          >
            Apply
          </button>
        </div>
      </div>
    </>
  )
}
