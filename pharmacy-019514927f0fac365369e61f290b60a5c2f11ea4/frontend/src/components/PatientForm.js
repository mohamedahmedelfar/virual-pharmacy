import{useState} from 'react';

const PatientForm = () => {
    const [UserName, setPatientUserName] = useState('')
    const [Name, setPatientName] = useState('')
    const [Email, setPatientEmail] = useState('')
    const [Password, setPatientPassword] = useState('')
    const [DateOfBirth, setPatientDateOfBirth] = useState('')
    const [Gender, setPatientGender] = useState('')
    const [MobileNumber, setPatientMobileNumber] = useState('')
    const [EmergencyContact, setPatientEmergencyContact] = useState([])
    const[FullName,setFullName]=useState('')
    const[MobileNumberEmergency,setMobileNumberEmergency]=useState('')
    const[RelationToPatient,setRelationToPtient]=useState('')
    const [error, setError] = useState(null)
    
    const handleSubmit = async(e) => {
        e.preventDefault()

        
        
        let patient= {UserName,Name,Email,Password,DateOfBirth,Gender,MobileNumber,"EmergencyContact" :{FullName,MobileNumberEmergency,RelationToPatient}}
        console.log(patient)
        const response = await fetch('http://localhost:4000/api/medicine/PatientSignUp', {
            method: 'POST',
           
            body: JSON.stringify(patient),
            headers: {
                'Content-Type': 'application/json'
            }
        })
         const json= await response.json()
        if(!response.ok){
            setError(json.error)
        }
        if (response.ok){
            setPatientUserName('')
            setPatientName('')
            setPatientEmail('')
            setPatientPassword('')
            setPatientDateOfBirth('')
            setPatientGender('')
            setPatientMobileNumber('')
            setPatientEmergencyContact('')
            setFullName('')
            setMobileNumberEmergency('')
            setPatientEmergencyContact('')
            setError(null)
            console.log('Patient Created')
        }

    }

    

    return (
        <form className="add-form" onSubmit={handleSubmit}>
            <h3>Add Patient</h3>

            <label> User Name</label>
            <input type="text"
             onChange={(e) => setPatientUserName(e.target.value)}
                value={UserName}
            />  
            <label> Name</label>
            <input type="text"
             onChange={(e) => setPatientName(e.target.value)}
                value={Name}
            />
            <label> Email</label>
            <input type="text"
             onChange={(e) => setPatientEmail(e.target.value)}
                value={Email}
            />
            <label> Password</label>
            <input type="text"
             onChange={(e) => setPatientPassword(e.target.value)}
                value={Password}
            />
            <label> Date Of Birth</label>
            <input type="date"
             onChange={(e) => setPatientDateOfBirth(e.target.value)}
                value={DateOfBirth}
            />
            <label> Gender</label>
            <input type="text"
            onChange={(e)=>setPatientGender(e.target.value)}
                value={Gender}
            />
            <label> Mobile Number</label>
            <input type="number"
             onChange={(e) => setPatientMobileNumber(e.target.value)}
                value={MobileNumber}
            />
            <label> Emergency Name</label>
            <input type="text"
             onChange={(e) => setFullName(e.target.value)}
                value={FullName}
            />
             <label> Emergency Number </label>
            <input type="text"
             onChange={(e) => setMobileNumberEmergency(e.target.value)}
                value={MobileNumberEmergency}
            />
             <label> Emergency RelationToPatient </label>
            <input type="text"
             onChange={(e) => setRelationToPtient(e.target.value)}
                value={RelationToPatient}
            />
            <button >Register</button>
            {error && <div className="error">{error}</div>}

        

            </form>


    )
}
        export default PatientForm

