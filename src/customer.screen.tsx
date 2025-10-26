'useclient';
import React, { useState } from 'react';

const CustomerOnboarding: React.FC = () => {
    const [customerData, setCustomerData] = useState({
        name: '',
        email: '',
        phone: '',
        vehicleModel: '',
        serviceNeeded: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setCustomerData({ ...customerData, [name]: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log('Customer Data:', customerData);
    };

    return (
        <div>
            <h1>Customer Onboarding</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input type="text" name="name" value={customerData.name} onChange={handleChange} required />
                </div>
                <div>
                    <label>Email:</label>
                    <input type="email" name="email" value={customerData.email} onChange={handleChange} required />
                </div>
                <div>
                    <label>Phone:</label>
                    <input type="tel" name="phone" value={customerData.phone} onChange={handleChange} required />
                </div>
                <div>
                    <label>Vehicle Model:</label>
                    <input type="text" name="vehicleModel" value={customerData.vehicleModel} onChange={handleChange} required />
                </div>
                <div>
                    <label>Service Needed:</label>
                    <select name="serviceNeeded" value={customerData.serviceNeeded} onChange={handleChange} required>
                        <option value="">Select a service</option>
                        <option value="oil_change">Oil Change</option>
                        <option value="tire_rotation">Tire Rotation</option>
                        <option value="brake_service">Brake Service</option>
                    </select>
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default CustomerOnboarding;