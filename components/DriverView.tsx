
import React from 'react';
import type { RideDetails } from '../types';
import { RideStatus } from '../types';
import Map from './Map';
import Card from './common/Card';
import Button from './common/Button';
import { VEHICLE_ICONS } from '../constants';

interface DriverViewProps {
  rideDetails: RideDetails | null;
  rideStatus: RideStatus;
  onAccept: () => void;
  onComplete: () => void;
  onReset: () => void;
}

const DriverView: React.FC<DriverViewProps> = ({ rideDetails, rideStatus, onAccept, onComplete, onReset }) => {
    
    const renderContent = () => {
        if (!rideDetails || rideStatus === RideStatus.IDLE || rideStatus === RideStatus.COMPLETED) {
            return (
                <div className="absolute inset-0 flex items-center justify-center p-4">
                    <Card className="text-center">
                        <h2 className="text-xl font-semibold text-gray-300">No active rides</h2>
                        <p className="text-gray-400 mt-2">You're online and ready for requests.</p>
                    </Card>
                </div>
            );
        }

        if (rideStatus === RideStatus.SEARCHING) {
             return (
                <div className="absolute bottom-0 left-0 right-0 p-4 z-10 flex justify-center">
                    <Card className="w-full max-w-md animate-pulse">
                        <h3 className="text-lg font-bold text-cyan-400">Incoming Ride Request!</h3>
                        <div className="mt-4 space-y-2 text-left">
                           <div className="flex justify-between">
                                <span className="text-gray-400">Pickup:</span>
                                <span className="font-semibold">{rideDetails.pickup}</span>
                           </div>
                           <div className="flex justify-between">
                                <span className="text-gray-400">Destination:</span>
                                <span className="font-semibold">{rideDetails.destination}</span>
                           </div>
                           <div className="flex justify-between items-center">
                                <span className="text-gray-400">Vehicle:</span>
                                <span className="font-semibold flex items-center gap-2">
                                    {VEHICLE_ICONS[rideDetails.vehicleType]}
                                    {rideDetails.vehicleType}
                                </span>
                           </div>
                            <div className="flex justify-between items-center pt-2">
                                <span className="text-gray-400">Estimated Fare:</span>
                                <span className="font-bold text-xl text-green-400">${rideDetails.fare?.toFixed(2)}</span>
                           </div>
                        </div>
                        <div className="mt-6 grid grid-cols-2 gap-4">
                            <Button variant="danger" onClick={onReset}>Decline</Button>
                            <Button variant="primary" onClick={onAccept}>Accept</Button>
                        </div>
                    </Card>
                </div>
             );
        }

        if (rideStatus === RideStatus.ACCEPTED || rideStatus === RideStatus.IN_PROGRESS) {
             return (
                 <div className="absolute bottom-0 left-0 right-0 p-4 z-10 flex justify-center">
                    <Card className="w-full max-w-md">
                        <h3 className="text-lg font-bold text-cyan-400">
                            {rideStatus === RideStatus.ACCEPTED ? "Pickup Passenger" : "Drop-off Passenger"}
                        </h3>
                        <div className="mt-4 space-y-2 text-left">
                           <div className="flex justify-between">
                                <span className="text-gray-400">{rideStatus === RideStatus.ACCEPTED ? "Pickup:" : "From:"}</span>
                                <span className="font-semibold">{rideDetails.pickup}</span>
                           </div>
                           <div className="flex justify-between">
                                <span className="text-gray-400">{rideStatus === RideStatus.ACCEPTED ? "Destination:" : "To:"}</span>
                                <span className="font-semibold">{rideDetails.destination}</span>
                           </div>
                        </div>
                        { rideStatus === RideStatus.IN_PROGRESS && (
                            <Button variant="primary" className="mt-6" onClick={onComplete}>Complete Ride</Button>
                        )}
                         <Button variant="secondary" className="mt-3" onClick={() => alert('Navigation functionality not implemented in demo.')}>Navigate</Button>
                    </Card>
                 </div>
             );
        }

        return null;
    }
    
  return (
    <div className="w-full h-full relative">
      <Map rideStatus={rideStatus} driver={rideDetails?.driver} />
      {renderContent()}
    </div>
  );
};

export default DriverView;
