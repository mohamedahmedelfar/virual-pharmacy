// MedicineEditForm.js

import { useState } from 'react';

const MedicineEditForm = ({ medicine, onCancel, onSave }) => {
  const [details, setDetails] = useState(medicine.details);
  const [price, setPrice] = useState(medicine.price);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedMedicine = {
      _id: medicine._id,
      name: medicine.name, // assuming the name doesn't change
      details,
      price,
      available_quantity: medicine.quantity, // assuming available quantity doesn't change
    };

    // Make a PUT request to update the medicine
    const response = await fetch(`http://localhost:4000/api/medicine/updateMedicine/${medicine._id}`, {
      method: 'PATCH',
      body: JSON.stringify(updatedMedicine),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const json = await response.json();

    if (response.ok) {
      onSave(json);
    }
  };

  return (
    <form className="create" onSubmit={handleSubmit}>
      <h3>Edit Medicine</h3>
      <label>Details:</label>
      <input
        type="text"
        onChange={(e) => setDetails(e.target.value)}
        value={details}
      />

      <label>Price:</label>
      <input
        type="number"
        onChange={(e) => setPrice(e.target.value)}
        value={price}
      />

      <button type="submit">Save Changes</button>
      <button type="button" onClick={onCancel}>Cancel</button>
    </form>
  );
};

export default MedicineEditForm;
