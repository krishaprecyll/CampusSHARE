.filters {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.filters-section {
  margin-bottom: 2rem;
}

.filters-section:last-child {
  margin-bottom: 0;
}

.filters-section h3 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #333;
}

.filter-options {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.filter-option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.filter-option:hover {
  background-color: #f0f4ff;
}

.filter-option input[type="radio"] {
  cursor: pointer;
  width: 16px;
  height: 16px;
  accent-color: #0066cc;
}

.filter-option span {
  font-size: 0.95rem;
  color: #555;
  user-select: none;
}

@media (max-width: 768px) {
  .filters {
    padding: 1rem;
  }

  .filters-section {
    margin-bottom: 1.5rem;
  }
}
