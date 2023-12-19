import { useMedicinesContext } from "../hooks/useMedicinesContext"


const MedicineDetails = ({ medicine,onEdit }) => {
  
  const {dispatch} = useMedicinesContext()
  
  const handleClick = async () => {
    const response = await fetch('/medicine/' + medicine._id, {
      method: 'DELETE'
    })
    const json = await response.json()

    if (response.ok) {
      dispatch({type: 'DELETE_MEDICINE', payload: json})
    }
  }

  return (
    <div className="workout-details">
      <h4>{medicine.name}</h4>
      <p><strong>Manufacturer:  </strong>{medicine.manufacturer}</p>
      <p><strong>Medicinal Use:  </strong>{medicine.medicinalUse}</p>
      <p><strong>Dosage:  </strong>{medicine.dosage}</p>
      
      <p><strong>Details:  </strong>{medicine.details}</p>
      <p><strong>Price:  </strong>{medicine.price}</p>
      <p><strong>Available Quantity:  </strong>{medicine.quantity}</p>
      {/* <p><strong>Prescription Required?:  </strong>{medicine.prescriptionRequired}</p> */}
      <p>{medicine.createdAt}</p>
      {/* <span onClick={handleClick}>delete</span> */}
      <span></span>
      <span onClick={() => onEdit(medicine)}>edit</span>
    </div>
  )
}

export default MedicineDetails