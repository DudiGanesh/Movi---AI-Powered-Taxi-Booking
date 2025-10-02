
import React, { useEffect } from 'react';
import type { RideDetails } from '../types';
import { RideStatus } from '../types';
import Map from './Map';
import BookingForm from './BookingForm';
import RideDetailsPanel from './RideDetails';
import Card from './common/Card';
import Button from './common/Button';
import LoadingSpinner from './common/LoadingSpinner';

interface UserViewProps {
  rideStatus: RideStatus;
  rideDetails: RideDetails | null;
  setRideStatus: React.Dispatch<React.SetStateAction<RideStatus>>;
  setRideDetails: React.Dispatch<React.SetStateAction<RideDetails | null>>;
  onRequestRide: (details: RideDetails) => void;
  onCancelRide: () => void;
  onFareCalculated: (fare: number) => void;
  onCompleteRide: () => void;
  onResetRide: () => void;
}

const UserView: React.FC<UserViewProps> = ({
  rideStatus,
  rideDetails,
  setRideStatus,
  setRideDetails,
  onRequestRide,
  onCancelRide,
  onFareCalculated,
  onCompleteRide,
  onResetRide,
}) => {
  useEffect(() => {
    let etaTimeout: NodeJS.Timeout;
    let rideTimeout: NodeJS.Timeout;

    if (rideStatus === RideStatus.ACCEPTED && rideDetails?.eta) {
      etaTimeout = setTimeout(() => {
        setRideStatus(RideStatus.IN_PROGRESS);
        setRideDetails(prev => prev ? { ...prev, rideDuration: 10 + Math.floor(Math.random() * 10)} : null);
      }, rideDetails.eta * 1000 * 1); // Mock: ETA in seconds for demo
    } else if (rideStatus === RideStatus.IN_PROGRESS && rideDetails?.rideDuration) {
        rideTimeout = setTimeout(() => {
            onCompleteRide();
        }, rideDetails.rideDuration * 1000 * 1); // Mock: duration in seconds for demo
    }

    return () => {
      clearTimeout(etaTimeout);
      clearTimeout(rideTimeout);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rideStatus, rideDetails, setRideStatus, onCompleteRide, setRideDetails]);

  const renderStatusOverlay = () => {
    switch (rideStatus) {
      case RideStatus.SEARCHING:
        return (
          <Card className="w-full max-w-md text-center">
            <h2 className="text-xl font-bold text-cyan-400 mb-4">Finding your ride...</h2>
            <div className="flex justify-center items-center my-6">
              <LoadingSpinner className="w-12 h-12" />
            </div>
            <p className="text-gray-400">Connecting with drivers near you.</p>
            {rideDetails && <p className="text-2xl font-bold mt-2">${rideDetails.fare?.toFixed(2)}</p>}
            <Button variant="secondary" onClick={onCancelRide} className="mt-6">
              Cancel Search
            </Button>
          </Card>
        );
      case RideStatus.COMPLETED:
         return (
             <Card className="w-full max-w-md text-center">
                 <h2 className="text-2xl font-bold text-cyan-400 mb-2">Ride Completed!</h2>
                 <p className="text-gray-300">Thank you for riding with Movi.</p>
                 <div className="my-4 p-4 bg-gray-900/50 rounded-lg">
                     <p className="text-sm text-gray-400">Total Fare</p>
                     <p className="text-4xl font-bold">${rideDetails?.fare?.toFixed(2)}</p>
                 </div>
                 <p className="text-sm text-gray-400">Payment processed successfully.</p>
                 <Button onClick={onResetRide} className="mt-6">
                     Book Another Ride
                 </Button>
             </Card>
         );
      default:
        return null;
    }
  };

  const showOverlay = rideStatus === RideStatus.SEARCHING || rideStatus === RideStatus.COMPLETED;

  return (
    <div className="w-full h-full">
      <Map rideStatus={rideStatus} driver={rideDetails?.driver} />

      <div className="absolute bottom-0 left-0 right-0 p-4 z-10 flex justify-center">
        {rideStatus === RideStatus.IDLE && (
          <BookingForm onRequestRide={onRequestRide} onFareCalculated={onFareCalculated} />
        )}
        {(rideStatus === RideStatus.ACCEPTED || rideStatus === RideStatus.IN_PROGRESS) && rideDetails && (
          <RideDetailsPanel 
            rideStatus={rideStatus}
            details={rideDetails}
            onCancel={onCancelRide}
            onComplete={onCompleteRide} 
          />
        )}
      </div>

      {showOverlay && (
        <div className="absolute inset-0 bg-black/50 z-10 flex items-center justify-center p-4">
          {renderStatusOverlay()}
        </div>
      )}
    </div>
  );
};

export default UserView;
