import React from 'react';
import { Link } from 'react-router-dom';

function HanaHome() {
  return (
    <div className="home">
      <div className="medicines">
        <Link to="/view-medicines">
          <button>View All Medicines</button>
        </Link>
        <Link to="/filter-medicines">
          <button>Filter Medicines</button>
        </Link>
      </div>
    </div>
  );
}

export default HanaHome;
