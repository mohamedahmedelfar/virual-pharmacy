import React, { useState, useEffect } from 'react';

function ViewOrders() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const username = localStorage.getItem('username'); // Replace with the actual username or get it dynamically
                const response = await fetch(`http://localhost:4000/api/medicine/viewOrders/${username}`);

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                setOrders(data.orders);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchOrders();
    }, []);

const handleCancelOrder = async (orderId) => {
    try {
        const username = localStorage.getItem('username');
        const response = await fetch(`http://localhost:4000/api/medicine/removeOrder/${username}/${orderId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: 'Cancelled' }), // Send the new status
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        // Update the order status in the state
        setOrders((prevOrders) =>
            prevOrders.map((order) =>
                order._id === orderId ? { ...order, status: 'Cancelled' } : order
            )
        );
    } catch (error) {
        console.error('Error canceling order:', error);
    }
};


    return (
        <div>
            <h1>Your Orders:</h1>
            {orders.map((order) => (
                <div key={order._id}>
                    <p>________</p>
                    <p>Status: {order.status}</p>
                    <p>Total Amount: {order.totalAmount}</p>
                    <p>Address: {`${order.address.street}, ${order.address.city}, ${order.address.state}, ${order.address.zipCode}`}</p>
                
                    <p>Items:</p>
                    <ul>
                        {order.items.map((item) => (
                            <li key={item.medicine}>
                                {item.medicine} - Quantity: {item.quantity}
                            </li>
                        ))}
                    </ul>

                    {/* Cancel Order Button */}
                    <button onClick={() => handleCancelOrder(order._id)}>Cancel Order</button>

                    <p>________</p>
                </div>
            ))}
        </div>
    );
}

export default ViewOrders;
