
export enum RideStatus {
  IDLE = 'IDLE',
  REQUESTING = 'REQUESTING',
  SEARCHING = 'SEARCHING',
  ACCEPTED = 'ACCEPTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum VehicleType {
  STANDARD = 'Standard',
  PREMIUM = 'Premium',
  XL = 'XL',
  SHARE = 'Share',
}

export interface Driver {
  id: number;
  name: string;
  rating: number;
  vehicle: {
    model: string;
    licensePlate: string;
    type: VehicleType;
  };
  location: {
    lat: number;
    lng: number;
  };
}

export interface RideDetails {
  pickup: string;
  destination: string;
  vehicleType: VehicleType;
  fare?: number;
  driver?: Driver;
  eta?: number; // ETA in minutes
  rideDuration?: number; // duration in minutes
}
