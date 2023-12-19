// NotificationsPage.js

import React, { useEffect, useState } from 'react';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const username = localStorage.getItem('username');

  const fetchNotifications = async () => {
    try {
      const response = await fetch('api/medicine/getAllNotifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });

      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications);
      } else {
        console.error('Error:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      const response = await fetch(`api/medicine/deleteNotification/${notificationId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Notification deleted successfully, update the state to reflect the change
        setNotifications((prevNotifications) =>
          prevNotifications.filter((notification) => notification._id !== notificationId)
        );
      } else {
        console.error('Error:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div>
      <h1>Notifications</h1>
      {loading ? (
        <p>Loading...</p>
      ) : notifications.length === 0 ? (
        <p>You don't have any notifications</p>
      ) : (
        <div>
          {notifications.map((notification) => (
            <div key={notification._id} style={notificationContainerStyle}>
              <p>Notification: {notification.message}</p>
              <p>Status: Unread</p>
              <p>Created At: {notification.timestamp}</p>
              <button onClick={() => deleteNotification(notification._id)}>Mark as read and Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const notificationContainerStyle = {
  border: '1px solid #ddd',
  padding: '10px',
  marginBottom: '10px',
  borderRadius: '5px',
  backgroundColor: 'beige',
};

export default NotificationsPage;
