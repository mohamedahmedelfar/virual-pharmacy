import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Make a GET request to your logout API endpoint
      const response = await axios.get('/api/medicine/logout');

      // Handle the response as needed, e.g., redirect or perform additional actions
      console.log(response.data); // You can customize this based on your API response
      alert('Logout successful!');
      navigate('/');
  

    } catch (error) {
      // Handle error, e.g., display an error message
      console.error('Logout failed', error);
    }
  };


  const handleGoBack = () => {
    navigate(-1); // Navigate back to the previous page
  };
  return (
    <header>
      <div className="content">
        <Link to="/">
          <h1>Rabena Yostor Pharmacy</h1>
        </Link>
        <button className="btn btn-primary" onClick={handleLogout}>
          Log Out
        </button>
        <button className="btn btn-secondary" onClick={handleGoBack}>
          Go Back
        </button>
      </div>
    </header>
  );
};
export default Navbar;
