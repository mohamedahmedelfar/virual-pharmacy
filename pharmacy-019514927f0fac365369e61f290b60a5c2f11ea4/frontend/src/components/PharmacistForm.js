import { useState } from "react";

const PharmacistForm = () => {
    const [UserName,setUserName] = useState('')
    const [Name,setName] = useState('')
    const [Email,setEmail] = useState('')
    const [Password,setPassword] = useState('')
    const [DateOfBirth,setDateOfBirth] = useState('')
    const [HourlyRate,setHourlyRate] = useState('')
    const [AffiliatedHospital,setAffiliatedHospital] = useState('')
    const [Education,setEducation] = useState('')
    const [error,setError] = useState(null)
    const [idFile, setIdFile] = useState(null);
    const [degreeFile, setDegreeFile] = useState(null);
    const [licenseFile, setLicenseFile] = useState([]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        // Create a new FormData object to send files alongside other data
        const formData = new FormData();
        formData.append('UserName', UserName);
        formData.append('Name', Name);
        formData.append('Email', Email);
        formData.append('Password', Password);
        formData.append('DateOfBirth', DateOfBirth);
        formData.append('HourlyRate', HourlyRate);
        formData.append('AffiliatedHospital', AffiliatedHospital);
        formData.append('Education', Education);
        formData.append('idFile', idFile);
        formData.append('degreeFile', degreeFile);
        formData.append('licenseFile', licenseFile);

        try {
            const response = await fetch('http://localhost:4000/api/medicine/PharmacistsignUp', {
                method: 'POST',
                body: formData,
            });
            console.log(response);
            const json = await response.json();
            if (!response.ok) {
                setError(json.error);
            } else {
                // Clear form fields and files after successful submission
                setUserName('');
                setName('');
                setEmail('');
                setPassword('');
                setDateOfBirth('');
                setHourlyRate('');
                setAffiliatedHospital('');
                setEducation('');
                setIdFile(null);
                setDegreeFile(null);
                setLicenseFile(null);
                setError(null);
                console.log('Pharmacist Created');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('File upload failed');
        }
    }
    const handleIdFileChange = (e) => {
        const file = e.target.files[0];
        console.log(file);
        setIdFile(file);
    };

    // Function to handle file input change for Degree file
    const handleDegreeFileChange = (e) => {
        const file = e.target.files[0];
        setDegreeFile(file);
    };

    // Function to handle file input change for License files (multiple)
    const handleLicenseFileChange = (e) => {
        const file = e.target.files[0];
        setLicenseFile(file);
    };
    return (
        <form className="add-form" onSubmit={handleSubmit}>
            <h3>Add Pharmacist</h3>

            <label> User Name</label>
            <input type="text"
             onChange={(e) => setUserName(e.target.value)}
                value={UserName}
            />  
            <label> Name</label>
            <input type="text"
             onChange={(e) => setName(e.target.value)}
                value={Name}
            />
            <label> Email</label>
            <input type="text"
             onChange={(e) => setEmail(e.target.value)}
                value={Email}
            />
            <label> Password</label>
            <input type="text"
             onChange={(e) => setPassword(e.target.value)}
                value={Password}
            />
            <label> Date Of Birth</label>
            <input type="date"
             onChange={(e) => setDateOfBirth(e.target.value)}
                value={DateOfBirth}
            />
            <label> Hourly Rate</label>
            <input type="number"
             onChange={(e) => setHourlyRate(e.target.value)}
                value={HourlyRate}
            />
            <label> Affiliated Hospital</label>
            <input type="text"
             onChange={(e) => setAffiliatedHospital(e.target.value)}
                value={AffiliatedHospital}
            />
            <label> Education</label>
            <input type="text"
             onChange={(e) => setEducation(e.target.value)}
                value={Education}
            />
            <div>
                <label>Upload ID File:</label>
                <input type="file" onChange={handleIdFileChange} accept=".jpg, .jpeg, .png, .pdf" />
            </div>
            <div>
                <label>Upload Degree File:</label>
                <input type="file" onChange={handleDegreeFileChange} accept=".jpg, .jpeg, .png, .pdf" />
            </div>
            <div>
                <label>Upload License File:</label>
                <input type="file" onChange={handleLicenseFileChange} accept=".jpg, .jpeg, .png, .pdf"  />
            </div>
            <button >Add Pharmacist </button>
            {error && <div className="error">{error}</div>}
            </form>
    )}
    export default PharmacistForm
