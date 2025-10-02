
import React, { useState, useCallback, useEffect } from 'react';
import type { RideDetails, Driver } from './types';
import { RideStatus, VehicleType } from './types';
import UserView from './components/UserView';
import DriverView from './components/DriverView';
import { MOCK_DRIVERS } from './constants';

const App: React.FC = () => {
  const [isDriverMode, setIsDriverMode] = useState(false);
  const [rideStatus, setRideStatus] = useState<RideStatus>(RideStatus.IDLE);
  const [rideDetails, setRideDetails] = useState<RideDetails | null>(null);

  // This simulates a driver accepting a ride request
  useEffect(() => {
    let searchTimeout: NodeJS.Timeout;
    if (rideStatus === RideStatus.SEARCHING && rideDetails) {
      searchTimeout = setTimeout(() => {
        const availableDrivers = MOCK_DRIVERS.filter(
          (d) => d.vehicle.type === rideDetails.vehicleType
        );
        const driver = availableDrivers[Math.floor(Math.random() * availableDrivers.length)];
        
        if (driver) {
          setRideDetails((prev) => prev ? { ...prev, driver, eta: 5 + Math.floor(Math.random() * 10) } : null);
          setRideStatus(RideStatus.ACCEPTED);
        } else {
            // No driver found, reset
            console.warn("No drivers found for the selected vehicle type.");
            setRideStatus(RideStatus.IDLE);
            setRideDetails(null);
        }

      }, 5000); // 5-second search
    }
    return () => clearTimeout(searchTimeout);
  }, [rideStatus, rideDetails]);


  const requestRide = useCallback((details: RideDetails) => {
    setRideDetails(details);
    setRideStatus(RideStatus.REQUESTING);
  }, []);

  const onFareCalculated = useCallback((fare: number) => {
    setRideDetails(prev => prev ? { ...prev, fare } : null);
    setRideStatus(RideStatus.SEARCHING);
  }, []);

  const cancelRide = useCallback(() => {
    setRideStatus(RideStatus.IDLE);
    setRideDetails(null);
  }, []);

  const completeRide = useCallback(() => {
    setRideStatus(RideStatus.COMPLETED);
  }, []);


  const resetRide = useCallback(() => {
    setRideStatus(RideStatus.IDLE);
    setRideDetails(null);
  }, []);

  return (
    <div className="h-screen w-screen bg-gray-900 text-white font-sans flex flex-col overflow-hidden">
      <header className="absolute top-0 left-0 right-0 z-20 flex justify-between items-center p-4 bg-gradient-to-b from-gray-900/80 to-transparent">
        <h1 className="text-3xl font-bold text-cyan-400 tracking-wider">Movi</h1>
        <div className="flex items-center space-x-2 bg-gray-800 rounded-full p-1">
          <button
            onClick={() => setIsDriverMode(false)}
            className={`px-4 py-1 rounded-full text-sm font-semibold transition-colors ${!isDriverMode ? 'bg-cyan-500 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
          >
            Passenger
          </button>
          <button
            onClick={() => setIsDriverMode(true)}
            className={`px-4 py-1 rounded-full text-sm font-semibold transition-colors ${isDriverMode ? 'bg-cyan-500 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
          >
            Driver
          </button>
        </div>
      </header>

      <main className="flex-1 relative">
        {isDriverMode ? (
          <DriverView
            rideDetails={rideDetails}
            rideStatus={rideStatus}
            onAccept={() => setRideStatus(RideStatus.ACCEPTED)}
            onComplete={completeRide}
            onReset={resetRide}
          />
        ) : (
          <UserView
            rideStatus={rideStatus}
            rideDetails={rideDetails}
            setRideDetails={setRideDetails}
            setRideStatus={setRideStatus}
            onRequestRide={requestRide}
            onCancelRide={cancelRide}
            onFareCalculated={onFareCalculated}
            onCompleteRide={completeRide}
            onResetRide={resetRide}
          />
        )}
      </main>
    </div>
  );
};

export default App;
