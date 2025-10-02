
import React from 'react';
import type { Driver } from './types';
import { VehicleType } from './types';

export const MOCK_DRIVERS: Driver[] = [
  {
    id: 1,
    name: 'Alex',
    rating: 4.9,
    vehicle: { model: 'Toyota Prius', licensePlate: 'B-123-XYZ', type: VehicleType.STANDARD },
    location: { lat: 34.0522, lng: -118.2437 },
  },
  {
    id: 2,
    name: 'Maria',
    rating: 4.8,
    vehicle: { model: 'Tesla Model S', licensePlate: 'E-456-ABC', type: VehicleType.PREMIUM },
    location: { lat: 34.055, lng: -118.25 },
  },
  {
    id: 3,
    name: 'John',
    rating: 4.7,
    vehicle: { model: 'Ford Explorer', licensePlate: 'S-789-DEF', type: VehicleType.XL },
    location: { lat: 34.048, lng: -118.24 },
  },
  {
      id: 4,
      name: 'Li',
      rating: 4.9,
      vehicle: { model: 'Honda Odyssey', licensePlate: 'V-101-GHI', type: VehicleType.SHARE },
      location: { lat: 34.06, lng: -118.23 },
    }
];

export const VEHICLE_ICONS: { [key in VehicleType]: React.ReactNode } = {
  [VehicleType.STANDARD]: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 16.5V14a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2.5"/><path d="M20 10h-5.5"/><path d="M4 10h5.5"/><path d="M12 10V5a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v0"/><path d="M12 10V3.5a2.5 2.5 0 0 1 5 0V10"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="18" r="2"/></svg>
  ),
  [VehicleType.PREMIUM]: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.5 19.5 2 12l8.5-7.5"/><path d="m22 12-8.5 7.5L22 12Zm-8.5-7.5L22 12"/></svg>
  ),
  [VehicleType.XL]: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="M16 2v4"/><path d="M8 2v4"/></svg>
  ),
  [VehicleType.SHARE]: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  ),
};
