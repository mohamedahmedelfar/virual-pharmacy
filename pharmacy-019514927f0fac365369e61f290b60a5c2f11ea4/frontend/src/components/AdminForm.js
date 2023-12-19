import{useState} from 'react';

const AdminForm = () => {
    const [AdminUserName, setAdminUserName] = useState('')
    const [AdminPassword, setAdminPassword] = useState('')
    const [error, setError] = useState(null)



    const handleSubmit = async(e) => {
        e.preventDefault()
        const admin = {AdminUserName,AdminPassword}
        const response = await fetch('http://localhost:4000/api/medicine/admin', {
            method: 'POST',
           
            body: JSON.stringify(admin),
            headers: {
                'Content-Type': 'application/json'
            }
        })
       const json= await response.json()
       if(!response.ok){
           setError(json.error)
       }
       if (response.ok){
        setAdminPassword('')
        setAdminUserName('')    
           setError(null)
           console.log('Admin Created')
       }
    }



    return (
        <form className="add-form" onSubmit={handleSubmit}>
            <h3>Add Admin</h3>

            <label>Admin User Name</label>
            <input type="text"
             onChange={(e) => setAdminUserName(e.target.value)}
                value={AdminUserName}
            />
            <label>Admin Password</label>
            <input type="text"
             onChange={(e) => setAdminPassword(e.target.value)}
                value={AdminPassword}
            />
            <button >Add Admin </button>
            {error && <div className="error">{error}</div>}
            </form>

            
    )
}

export default AdminForm