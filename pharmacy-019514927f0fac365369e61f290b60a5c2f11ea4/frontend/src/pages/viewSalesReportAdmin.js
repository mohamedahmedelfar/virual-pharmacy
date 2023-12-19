import React, { useState, useEffect } from 'react';

export default function ViewSalesReportAdmin() {
    const [selectedDay, setSelectedDay] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [years, setYears] = useState([]);
    const [data, setData] = useState(null);
    const [filterData, setFilterData] = useState(null);
    const [filterByNameData, setFilterByNameData] = useState(null);
    const [name, setName] = useState('');
    useEffect(() => {
        // Dynamically generate a list of years, you can adjust the range as needed
        const currentYear = new Date().getFullYear();
        const yearRange = Array.from({ length: 30 }, (_, index) => currentYear - index);
        setYears(yearRange);
    }, []);

    const handleDayChange = (e) => {
        setSelectedDay(e.target.value);
    };

    const handleMonthChange = (e) => {
        setSelectedMonth(e.target.value);
        const monthSelect = document.getElementById('month');
        const daySelect = document.getElementById('day');

        // Clear existing options
        daySelect.innerHTML = '<option value="">-- Select Day --</option>';

        const selectedMonth = parseInt(monthSelect.value, 10);
        var daysInMonth = new Date(new Date().getFullYear(), selectedMonth + 1, 0).getDate();
        if(selectedYear % 4 === 0 && selectedMonth === 1)
            daysInMonth = 29;


        // Populate days based on selected month
        for (let i = 1; i <= daysInMonth; i++) {
            const option = document.createElement('option');
            option.value = i.toString();
            option.text = i.toString();
            daySelect.appendChild(option);
        }
    };
    const handleYearChange = (e) => {
        setSelectedYear(e.target.value);
    };

    const handleNameFilter = async () => {
        try {
            // Validate that both month and year are selected
            if (!selectedMonth || !selectedYear) {
                console.error('Please select both month and year.');
                return;
            }
            const name = document.getElementsByName("name")[0].value;
            setName(name);
            console.log(name);
            // Make an API call to fetch sales data for the selected month and year
            const filterByNameResponse = await fetch(`http://localhost:4000/api/medicine/filterSalesReport/${selectedYear}/${selectedMonth}/${name}`);
            const filterByNameData = await filterByNameResponse.json();
            setFilterByNameData(filterByNameData);

            if (filterByNameResponse.ok) {
                // Handle the fetched data, e.g., update state or display the information
                console.log('Sales Report Filter:', filterByNameData);
            } else {
                console.error('Failed to fetch sales report filter:', filterByNameData.error);
            }
        }catch (error) {}
    }


    const handleFilter = async () => {
        try {
            // Validate that both month and year are selected
            if (!selectedMonth || !selectedYear || !selectedDay) {
                console.error('Please select day, month and year.');
                return;
            }

            // Make an API call to fetch sales data for the selected month and year
            const filterResponse = await fetch(`http://localhost:4000/api/medicine/salesReport/${selectedYear}/${selectedMonth}/${selectedDay}`);
            const filterData = await filterResponse.json();
            setFilterData(filterData);

            if (filterResponse.ok) {
                // Handle the fetched data, e.g., update state or display the information
                console.log('Sales Report Filter:', filterData);
            } else {
                console.error('Failed to fetch sales report filter:', filterData.error);
            }
        }catch (error) {

        }
    }

    const handleSubmit = async () => {
        try {
            // Validate that both month and year are selected
            if (!selectedMonth || !selectedYear) {
                console.error('Please select both month and year.');
                return;
            }

            // Make an API call to fetch sales data for the selected month and year
            const response = await fetch(`http://localhost:4000/api/medicine/salesReport/${selectedYear}/${selectedMonth}`);
            const data = await response.json();
            setData(data);


            if (response.ok) {
                // Handle the fetched data, e.g., update state or display the information
                console.log('Sales Report Data:', data);
            } else {
                console.error('Failed to fetch sales report:', data.error);
            }
        } catch (error) {
            console.error('Error fetching sales report:', error);
        }
    };

    return (
        <div>
            <h1>View Sales Report</h1>
            <label>Select Year: </label>
            <select value={selectedYear} onChange={handleYearChange}>
                <option value="">-- Select Year --</option>
                {years.map((year) => (
                    <option key={year} value={year}>
                        {year}
                    </option>
                ))}
            </select>
            <br />
            <label>Select Month: </label>
            <select id="month" onChange={handleMonthChange}>
                <option value="">-- Select Month --</option>
                <option value="0">January</option>
                <option value="1">February</option>
                <option value="2">March</option>
                <option value="3">April</option>
                <option value="4">May</option>
                <option value="5">June</option>
                <option value="6">July</option>
                <option value="7">August</option>
                <option value="8">Septemper</option>
                <option value="9">October</option>
                <option value="10">November</option>
                <option value="11">Decemeber</option>
                
            </select>
            <br />
            <button onClick={handleSubmit}>Submit</button>
            <div className="requests">
                {data && data.map((request) => (
                    request.map((request1) => (
                        request1.items.map((request2) => (
                        <div key={request2._id}>
                        <p>{request1.notes}</p>
                        <p>Medicine Name: {request2.medicine}, Quantity: {request2.quantity}</p>
                    </div>
                    ))))))} 
            </div>
            
        

         
          
                     
            
        </div>
    );
}
