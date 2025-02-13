import React from "react";
import "./flight.css";

interface FlightProps {
  flightID: string;
  planeName: string;
  departureTime: string;
  arrivalTime: string;
  totalFlightTime: string;
  withCheckBox: boolean;
  sourceID: string;
  destinationID: string;
  departDate: string; // Add departDate property
  arriveDate: string; // Add arriveDate property
}

const Flight: React.FC<FlightProps> = ({
  flightID,
  planeName,
  departureTime,
  arrivalTime,
  totalFlightTime,
  withCheckBox,
  sourceID,
  destinationID,
  departDate,
  arriveDate,
}) => {
  return (
    <div className="flightBox flex items-start border rounded-xl border-black text-black text-lg font-semibold leading-7">
      <p className="box self-stretch">
        Flight ID: <br />
        <span className=" text-gray-500">{flightID}</span>
      </p>
      <p className="box self-stretch">
        Plane Name: <br />
        <span className=" text-gray-500">{planeName}</span>
      </p>
      <p className="box self-stretch">
        Departure Time: <br />
        <span className=" text-gray-500">{departureTime}</span>
      </p>
      <p className="box self-stretch">
        Arrival Time: <br />
        <span className=" text-gray-500">{arrivalTime}</span>
      </p>
      <p className="box self-stretch">
        Source ID: <br />
        <span className=" text-gray-500">{sourceID}</span>
      </p>
      <p className="box self-stretch">
        Destination ID: <br />
        <span className=" text-gray-500">{destinationID}</span>
      </p>
      <p className="box self-stretch">
        Departure Date: <br /> {/* Add Departure Date */}
        <span className=" text-gray-500">{departDate}</span>
      </p>
      <p className="box self-stretch">
        Arrival Date: <br /> {/* Add Arrival Date */}
        <span className=" text-gray-500">{arriveDate}</span>
      </p>
      {/* <p className="box self-stretch">
        Total Flight Time: <br />
        <span className=" text-gray-500">{totalFlightTime}</span>
      </p> */}
    </div>
  );
};

export default Flight;
