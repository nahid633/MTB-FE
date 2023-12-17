export  interface Booking {
  userDetails: {
    name: string;
    email: string;
    contactNumber:string;
  },
  vehicleInfo: {
    make: string;
    model: string;
    registrationNumber: string;
    type: string;
  },
  testDetails: {
    testType: string;
    preferredDate: string;
    timeSlot: string;
    specialRequirements: string;
  },
  status: string;
  createdAt: string;
  updatedAt: string;
}
