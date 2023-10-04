import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PaydayList = () => {
    const [paydays, setPaydays] = useState([]);

    useEffect(() => {
        // Fetch payday data from the API and set it in the state
        axios.get('http://localhost:5000/paydays') // Adjust the URL to match your backend
            .then((response) => setPaydays(response.data))
            .catch((error) => console.error(error));
    }, []);

    return (
        <div>
            <h2>Payday List</h2>
            <ul>
                {paydays.map((payday) => (
                    <li key={payday._id}>
                        Date: {payday.date} - Description: {payday.description}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PaydayList;