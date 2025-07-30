import React from 'react';
import { Dropdown } from 'react-bootstrap';

interface FilterDropdownProps {
    categories: string[];
    selectedCategory: string;
    onCategoryChange: (category: string) => void;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({ categories, selectedCategory, onCategoryChange }) => {
  return (
    <Dropdown>
      <Dropdown.Toggle variant="dark" id="dropdown-categories">
        {selectedCategory === 'all' ? 'Todas las categorías' : selectedCategory}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item onClick={() => onCategoryChange('all')}>
          Todas
        </Dropdown.Item>
        {categories.map(category => (
          <Dropdown.Item
            key={category}
            onClick={() => onCategoryChange(category)}
          >
            {category}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default FilterDropdown;
