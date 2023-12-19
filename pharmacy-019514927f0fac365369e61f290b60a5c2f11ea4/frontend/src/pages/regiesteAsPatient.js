import{useEffect,useState} from 'react'


import PatientForm from '../components/PatientForm'

const RegiesteAsPatient = () => {
    const [patient, setPatient] = useState(null)

useEffect(() => {   
    const fetchPatient = async () => {
        const response = await fetch('http://localhost:4000/api/medicine/PatientSignUp')
        const json = await response.json()
        if(response.ok){
            setPatient(json)
        }
    }
    fetchPatient()
},[])   
    //return a form to create a new patient
    return (
        <div className="home">
           <PatientForm/>
        
            </div>
    )
}
export default RegiesteAsPatient