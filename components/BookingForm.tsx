
import React, { useState } from 'react';
import type { RideDetails } from '../types';
import { VehicleType } from '../types';
import { calculateFare } from '../services/geminiService';
import Card from './common/Card';
import Button from './common/Button';
import { VEHICLE_ICONS } from '../constants';
import LoadingSpinner from './common/LoadingSpinner';

interface BookingFormProps {
  onRequestRide: (details: RideDetails) => void;
  onFareCalculated: (fare: number) => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ onRequestRide, onFareCalculated }) => {
  const [pickup, setPickup] = useState('123 Main St, Anytown');
  const [destination, setDestination] = useState('456 Oak Ave, Anytown');
  const [vehicleType, setVehicleType] = useState<VehicleType>(VehicleType.STANDARD);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pickup || !destination) {
      setError("Please enter both pickup and destination locations.");
      return;
    }
    setError(null);
    setIsLoading(true);

    const rideDetails: RideDetails = { pickup, destination, vehicleType };
    onRequestRide(rideDetails);

    const fare = await calculateFare(pickup, destination, vehicleType);
    setIsLoading(false);

    if (fare !== null) {
      onFareCalculated(fare);
    } else {
      setError("Could not calculate fare. Please try again.");
      // In a real app, you would also revert the ride status here
    }
  };

  return (
    <Card className="w-full max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="pickup" className="block text-sm font-medium text-gray-400">Pickup Location</label>
          <input
            type="text"
            id="pickup"
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
            className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
            placeholder="Enter pickup address"
          />
        </div>
        <div>
          <label htmlFor="destination" className="block text-sm font-medium text-gray-400">Destination</label>
          <input
            type="text"
            id="destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
            placeholder="Enter destination address"
          />
        </div>

        <div>
          <span className="block text-sm font-medium text-gray-400 mb-2">Ride Type</span>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {Object.values(VehicleType).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setVehicleType(type)}
                className={`flex flex-col items-center justify-center p-2 rounded-lg border-2 transition-colors ${
                  vehicleType === type ? 'bg-cyan-500/20 border-cyan-500' : 'bg-gray-700/50 border-gray-600 hover:border-cyan-600'
                }`}
              >
                <div className="h-6 w-6 mb-1">{VEHICLE_ICONS[type]}</div>
                <span className="text-xs font-semibold">{type}</span>
              </button>
            ))}
          </div>
        </div>

        {error && <p className="text-red-400 text-sm text-center">{error}</p>}

        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <div className="flex items-center justify-center">
              <LoadingSpinner />
              <span className="ml-2">Getting Fare...</span>
            </div>
          ) : (
            'Request Ride'
          )}
        </Button>

        <div className="flex justify-around text-xs text-gray-400 pt-2">
            <button type="button" className="flex items-center space-x-1 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>
                <span>Schedule</span>
            </button>
             <button type="button" className="flex items-center space-x-1 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                <span>Ride Share</span>
            </button>
        </div>

      </form>
    </Card>
  );
};

export default BookingForm;
