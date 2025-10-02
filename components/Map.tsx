
import React, { useEffect, useState } from 'react';
import type { Driver } from '../types';
import { RideStatus } from '../types';

interface MapProps {
    rideStatus: RideStatus;
    driver?: Driver;
}

interface Point {
    x: number;
    y: number;
}

const UserPin: React.FC = () => (
    <div className="absolute w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-lg" style={{ transform: 'translate(-50%, -50%)' }}></div>
);

const DestinationPin: React.FC = () => (
    <div className="absolute w-4 h-4 bg-green-500 border-2 border-white shadow-lg" style={{ transform: 'translate(-50%, -100%)' }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
    </div>
);

const CarIcon: React.FC<{ rotation: number }> = ({ rotation }) => (
    <div className="absolute" style={{ transform: `translate(-50%, -50%) rotate(${rotation}deg)` }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-400 drop-shadow-lg">
            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/>
            <circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>
        </svg>
    </div>
);

const Map: React.FC<MapProps> = ({ rideStatus, driver }) => {
    const userPos: Point = { x: 40, y: 75 };
    const destPos: Point = { x: 70, y: 25 };
    
    const [carPos, setCarPos] = useState<Point>({ x: 10, y: 15 });
    const [carRotation, setCarRotation] = useState(45);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        const animateTo = (targetPos: Point, duration: number) => {
            const startPos = { ...carPos };
            const dx = targetPos.x - startPos.x;
            const dy = targetPos.y - startPos.y;
            setCarRotation(Math.atan2(dy, dx) * 180 / Math.PI + 90);
            
            let startTime: number | null = null;
            const step = (timestamp: number) => {
                if (!startTime) startTime = timestamp;
                const progress = Math.min((timestamp - startTime) / duration, 1);
                
                setCarPos({
                    x: startPos.x + dx * progress,
                    y: startPos.y + dy * progress,
                });

                if (progress < 1) {
                    requestAnimationFrame(step);
                }
            };
            requestAnimationFrame(step);
        };
        
        if (rideStatus === RideStatus.ACCEPTED) {
            // Animate car to user
            animateTo(userPos, 5000);
        } else if (rideStatus === RideStatus.IN_PROGRESS) {
            // Animate car from user to destination
            animateTo(destPos, 8000);
        } else if (rideStatus === RideStatus.IDLE || rideStatus === RideStatus.COMPLETED || rideStatus === RideStatus.CANCELLED) {
            // Reset car position
            setCarPos({ x: 10, y: 15 });
            setCarRotation(45);
        }

        return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rideStatus]);

    const showRoute = rideStatus === RideStatus.IN_PROGRESS || rideStatus === RideStatus.ACCEPTED;

    return (
        <div className="absolute inset-0 w-full h-full bg-gray-800 overflow-hidden">
            {/* Map Grid Background */}
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                        <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(107, 114, 128, 0.1)" strokeWidth="0.5"/>
                    </pattern>
                    <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                        <rect width="50" height="50" fill="url(#smallGrid)"/>
                        <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(107, 114, 128, 0.2)" strokeWidth="1"/>
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
            
            {/* Pins and Car */}
            <div className="absolute inset-0">
                {/* Route Line */}
                {showRoute && (
                     <svg width="100%" height="100%" className="absolute inset-0">
                        {rideStatus === RideStatus.ACCEPTED && 
                            <path d={`M ${carPos.x}% ${carPos.y}% Q ${carPos.x}% ${userPos.y-10}%, ${userPos.x}% ${userPos.y}%`} stroke="#34D399" strokeWidth="3" fill="none" strokeDasharray="6 6"/>
                        }
                        {rideStatus === RideStatus.IN_PROGRESS && 
                            <path d={`M ${userPos.x}% ${userPos.y}% Q ${userPos.x}% ${destPos.y+10}%, ${destPos.x}% ${destPos.y}%`} stroke="#22D3EE" strokeWidth="3" fill="none" strokeDasharray="8 8"/>
                        }
                    </svg>
                )}

                {/* User Pin */}
                <div style={{ top: `${userPos.y}%`, left: `${userPos.x}%` }}>
                   <UserPin />
                </div>

                {/* Destination Pin */}
                {(rideStatus !== RideStatus.IDLE && rideStatus !== RideStatus.REQUESTING && rideStatus !== RideStatus.SEARCHING) &&
                    <div style={{ top: `${destPos.y}%`, left: `${destPos.x}%` }}>
                        <DestinationPin />
                    </div>
                }

                {/* Car */}
                {(rideStatus === RideStatus.ACCEPTED || rideStatus === RideStatus.IN_PROGRESS) && driver &&
                    <div className="transition-all duration-500 linear" style={{ top: `${carPos.y}%`, left: `${carPos.x}%` }}>
                       <CarIcon rotation={carRotation} />
                    </div>
                }
            </div>
        </div>
    );
};

export default Map;
