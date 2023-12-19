import { useState } from 'react'
import { useMedicinesContext } from '../hooks/useMedicinesContext'

const MedicineForm = () => {
  const {dispatch} = useMedicinesContext()
  const [name, setName] = useState('')
  const [details, setDetails] = useState('')
  const [price, setPrice] = useState('')
  const [quantity, setAQ] = useState('')
  
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()

    const medicine = {name,details,price,quantity}
    
    const response = await fetch('http://localhost:4000/api/medicine/addMedicine', {
      method: 'POST',
      body: JSON.stringify(medicine),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const json = await response.json()

    if (!response.ok) {
      setError(json.error)
    }
    if (response.ok) {
      setError(null)
      setName('')
      setDetails('')
      setPrice('')
      setAQ('')
      console.log('new medicine added:', json)
      dispatch({type: 'CREATE_MEDICINE', payload: json})

    }

  }

  return (
    <form className="create" onSubmit={handleSubmit}> 
      <h3>Add a New Medicine</h3>

      <label>Name:</label>
      <input 
        type="text" 
        onChange={(e) => setName(e.target.value)} 
        value={name}
      />

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

      <label>Available Quantity:</label>
      <input 
        type="number" 
        onChange={(e) => setAQ(e.target.value)} 
        value={quantity} 
      />

      <button>Add Medicine</button>
      {error && <div className="error">{error}</div>}
    </form>
  )
}

export default MedicineForm