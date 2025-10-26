'use client';
import React, { useState, useEffect } from 'react';
import { FiSearch, FiFilter } from 'react-icons/fi'; // You'll need to install react-icons

interface Vehicle {
    id: number;
    make: string;
    model: string;
    year: string;
    status: string;
    jobNumber: string;
    serviceType: string;
}

const JobCardList: React.FC = () => {
    const [vehicles, setVehicles] = useState<Vehicle[]>([
        // Your existing data
    ]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);

    useEffect(() => {
        const filtered = vehicles.filter(vehicle => 
            vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vehicle.jobNumber.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredVehicles(filtered);
    }, [searchTerm, vehicles]);

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Vehicle Job Cards</h1>
                <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                    + New Job Card
                </button>
            </div>

            <div className="mb-6 flex gap-4">
                <div className="relative flex-1">
                    <FiSearch className="absolute left-3 top-3 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by make, model, or job number..."
                        className="w-full pl-10 pr-4 py-2 border rounded-lg"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="px-4 py-2 border rounded-lg flex items-center gap-2">
                    <FiFilter /> Filter
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVehicles.map((vehicle) => (
                    // Your existing card component
                    <div
                        key={vehicle.id}
                        className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
                    >
                        {/* Your existing card content */}
                    </div>
                ))}
            </div>

            {filteredVehicles.length === 0 && (
                <div className="text-center py-10 text-gray-500">
                    No vehicles found matching your search criteria.
                </div>
            )}
        </div>
    );
};

export default JobCardList;