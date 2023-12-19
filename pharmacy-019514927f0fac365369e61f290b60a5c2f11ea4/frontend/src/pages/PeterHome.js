import { useEffect, useState } from "react"
import { useMedicinesContext } from "../hooks/useMedicinesContext"
// components
import MedicineDetails from '../components/MedicineDetails'
import MedicineForm from "../components/MedicineForm"
import MedicineEditForm from "../components/MedicineEditForm"


const HomePeter = () => {
  const {medicines , dispatch} = useMedicinesContext()
  const [editMedicine, setEditMedicine] = useState(null);
  const handleEdit = (medicine) => {
    setEditMedicine(medicine);
  };

  const handleCancelEdit = () => {
    setEditMedicine(null);
  };

  const handleSaveEdit = async (updatedMedicine) => {
    // Make a PUT request to update the medicine on the server
    await fetch(`/api/medicine/updateMedicine/${updatedMedicine._id}`, {
      method: 'PUT',
      body: JSON.stringify(updatedMedicine),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  
    // Fetch the updated list of medicines
    const response = await fetch('/api/medicine/getAllMedicines');
    const json = await response.json();
  
    // Update the state with the fetched data
    dispatch({ type: 'SET_MEDICINES', payload: json });
  
    // Close the edit form
    setEditMedicine(null);
  };
  useEffect(() => {
    const fetchMedicines = async () => {
      const response = await fetch('/api/medicine/getAllMedicines')
      const json = await response.json()

      if (response.ok) {
        dispatch({type: 'SET_MEDICINES', payload: json})
      }
    }

    fetchMedicines()
  }, [])

  return (
    <div className="home">
      <div className="workouts">
        {medicines && medicines.map(medicine => (
          <MedicineDetails
            medicine={medicine}
            key={medicine._id}
            onEdit={handleEdit}
          />
        ))}
      </div>
      {editMedicine && (
        <MedicineEditForm
          medicine={editMedicine}
          onCancel={handleCancelEdit}
          onSave={handleSaveEdit}
        />
      )}
      <MedicineForm />
    </div>
  )
}

export default HomePeter