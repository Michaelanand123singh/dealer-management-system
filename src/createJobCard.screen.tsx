import React, { useState } from 'react';

const JobCardCreation: React.FC = () => {
    const [vehicleId, setVehicleId] = useState('');
    const [driverName, setDriverName] = useState('');
    const [jobDescription, setJobDescription] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle job card creation logic here
        console.log({ vehicleId, driverName, jobDescription });
    };

    return (
        <div>
            <h1>Create Job Card for Vehicle Onboarding</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="vehicleId">Vehicle ID:</label>
                    <input
                        type="text"
                        id="vehicleId"
                        value={vehicleId}
                        onChange={(e) => setVehicleId(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="driverName">Driver Name:</label>
                    <input
                        type="text"
                        id="driverName"
                        value={driverName}
                        onChange={(e) => setDriverName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="jobDescription">Job Description:</label>
                    <textarea
                        id="jobDescription"
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Create Job Card</button>
            </form>
        </div>
    );
};

export default JobCardCreation;