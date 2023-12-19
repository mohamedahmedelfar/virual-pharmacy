import { useEffect, useState } from "react";

const KhaledHome = () => {
    const [requests, setRequests] = useState(null);
    useEffect(() => {
        const fetchRequests = async () => {
            const response = await fetch('http://localhost:4000/api/medicine/viewPharmacistsRequests');
            const json = await response.json();
            if (response.ok) {
                setRequests(json);
            }
        }
        fetchRequests();
    }, []);
    const handleAccept = async (requestId, UserName) => {
        fetch(`/api/medicine/acceptPharmacistRequest/${UserName}`, {
            method: 'POST'
        }).then(response => {
            console.log(response.status)
            if (response.status === 200) {
                // If the request was successful, update the state to remove the accepted request
                setRequests(requests.filter((request) => request._id !== requestId));
            }
        });
    };
    
    const handleReject = (requestId, UserName) => {
        // Make a DELETE request to remove the document from the database
        fetch(`/api/medicine/rejectPharmacistRequest/${UserName}`, {
            method: 'DELETE'
        })
        .then(response => {
            console.log(response.status)
            if (response.status === 200) {
                // If the request was successful, update the state to remove the rejected request
                setRequests(requests.filter((request) => request._id !== requestId));
            }
        });
    };
    return (
        <div className="home">
            <div className="requests">
                {requests && requests.map((request) => (
                    <div key={request._id}>
                    <p>Name: {request.Name}, Email: {request.Email}, Education: {request.Education}</p>
                    <button onClick={() => handleAccept(request._id, request.UserName)}>Accept</button>
                    <button onClick={() => handleReject(request._id, request.UserName)}>Reject</button>
                </div>
                ))}
            </div>
        </div>
    );
}
export default KhaledHome;
