
import React, { useState, useEffect } from 'react';
import type { RideDetails } from '../types';
import { RideStatus } from '../types';
import Card from './common/Card';
import Button from './common/Button';
import SupportModal from './SupportModal';

interface RideDetailsProps {
    rideStatus: RideStatus;
    details: RideDetails;
    onCancel: () => void;
    onComplete: () => void;
}

const RideDetailsPanel: React.FC<RideDetailsProps> = ({ rideStatus, details, onCancel, onComplete }) => {
    const { driver, eta, fare, rideDuration } = details;
    const [currentEta, setCurrentEta] = useState(eta);
    const [rideProgress, setRideProgress] = useState(0);
    const [isSupportOpen, setIsSupportOpen] = useState(false);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (rideStatus === RideStatus.ACCEPTED && currentEta && currentEta > 0) {
            timer = setTimeout(() => setCurrentEta(currentEta - 1), 60000); // decrement every minute
        } else if (rideStatus === RideStatus.IN_PROGRESS) {
             const durationInMs = (rideDuration || 10) * 60 * 1000;
             const interval = setInterval(() => {
                setRideProgress(prev => Math.min(prev + (1000/durationInMs)*100, 100));
            }, 1000);
            return () => clearInterval(interval);
        }
        return () => clearTimeout(timer);
    }, [rideStatus, currentEta, rideDuration]);

    if (!driver) return null;

    const getStatusText = () => {
        switch (rideStatus) {
            case RideStatus.ACCEPTED:
                return `Arriving in ${currentEta} min`;
            case RideStatus.IN_PROGRESS:
                return "On your way to destination";
            default:
                return "Connecting...";
        }
    };

    return (
        <>
        <Card className="w-full max-w-md">
            <div className="flex items-center space-x-4">
                <img src={`https://i.pravatar.cc/64?u=${driver.id}`} alt={driver.name} className="w-16 h-16 rounded-full border-2 border-cyan-400" />
                <div>
                    <h3 className="text-xl font-bold">{driver.name}</h3>
                    <div className="flex items-center text-sm text-gray-300">
                        <span>{driver.rating}</span>
                        <svg className="w-4 h-4 text-yellow-400 fill-current ml-1" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
                    </div>
                </div>
            </div>

            <div className="mt-4 p-3 bg-gray-900/50 rounded-lg">
                <p className="text-sm text-gray-400">{driver.vehicle.model}</p>
                <p className="text-lg font-mono tracking-widest">{driver.vehicle.licensePlate}</p>
            </div>

            <div className="mt-4">
                <div className="flex justify-between items-baseline mb-1">
                    <span className="text-cyan-400 font-semibold">{getStatusText()}</span>
                    {fare && <span className="text-2xl font-bold">${fare.toFixed(2)}</span>}
                </div>
                { rideStatus === RideStatus.IN_PROGRESS && (
                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                        <div className="bg-cyan-400 h-2.5 rounded-full" style={{ width: `${rideProgress}%` }}></div>
                    </div>
                )}
            </div>
            
            <div className="mt-6 grid grid-cols-2 gap-3">
                 <Button variant="secondary" onClick={() => setIsSupportOpen(true)}>24/7 Support</Button>
                 <Button variant="danger" onClick={() => alert('Emergency assistance has been notified.')}>Emergency</Button>
            </div>
            {rideStatus === RideStatus.ACCEPTED && 
                <Button variant="secondary" onClick={onCancel} className="mt-3">Cancel Ride</Button>
            }

        </Card>
        {isSupportOpen && <SupportModal onClose={() => setIsSupportOpen(false)} />}
        </>
    );
};

export default RideDetailsPanel;
