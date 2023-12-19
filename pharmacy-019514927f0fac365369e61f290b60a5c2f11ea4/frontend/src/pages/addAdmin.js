import{useEffect,useState} from 'react'
//import { json } from 'react-router-dom'
//components
//import WorkoutDetails from '../components/WorkoutDetails'

import AdminForm from '../components/AdminForm'

const AddAdmin = () => {
    const [admin, setAdmin] = useState(null)

useEffect(() => {
    const fetchAdmin = async () => {
        const response = await fetch('http://localhost:4000/api/medicine/admin')
        const json = await response.json()
        if(response.ok){
            setAdmin(json)
        }
    }


    fetchAdmin()
},[])
   //CREATE a homepage that choose to go to any page
return (
    <div className="home">
        <AdminForm/>
    </div>
)

}
export default AddAdmin