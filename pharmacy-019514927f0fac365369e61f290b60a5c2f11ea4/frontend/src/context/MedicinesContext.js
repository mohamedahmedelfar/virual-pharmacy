import { createContext, useReducer } from 'react'

export const MedicinesContext = createContext()

export const medicinesReducer = (state, action) => {
  switch (action.type) {
    case 'SET_MEDICINES':
      return { 
        medicines: action.payload 
      };
    case 'CREATE_MEDICINE':
      return { 
        medicines: [action.payload, ...state.medicines] 
      };
    case 'DELETE_MEDICINE':
      return { 
        medicines: state.medicines.filter(medicine => medicine._id !== action.payload._id) 
      };
    case 'UPDATE_MEDICINE':
      const updatedIndex = state.medicines.findIndex(medicine => medicine._id === action.payload._id);
      if (updatedIndex !== -1) {
        const updatedMedicines = [...state.medicines];
        updatedMedicines[updatedIndex] = action.payload;
        return { medicines: updatedMedicines };
      }
      return state;

    default:
      return state;
  }
};

export const MedicinesContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(medicinesReducer, { 
    medicines: null
  })
  
  return (
    <MedicinesContext.Provider value={{ ...state, dispatch }}>
      { children }
    </MedicinesContext.Provider>
  )
}