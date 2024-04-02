import React, { useState, useEffect } from "react";
import Flight from "../components/flight";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const SelectFlight: React.FC<Props> = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [nameValue, setNameValue] = useState("");
  const [emailValue, setEmailValue] = useState("");

  function convertToTime(timeNumber) {
    const hours = Math.floor(timeNumber / 100);
    const minutes = timeNumber % 100;

    // Validate the input for hours and minutes
    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
      return "Invalid time format";
    }

    // Determine AM/PM
    const amPm = hours >= 12 ? "pm" : "am";

    // Convert hours to 12-hour format, adjusting for "0"
    let formattedHours = (hours % 12 || 12).toString(); // Convert to string

    // Format hours and minutes with leading zeros
    formattedHours = formattedHours.padStart(2, "0"); // Apply padStart method
    const formattedMinutes = minutes.toString().padStart(2, "0");

    // Construct the final time string
    return `${formattedHours}:${formattedMinutes} ${amPm}`;
  }

  const handleNameChange = (event) => {
    setNameValue(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmailValue(event.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    fetch(
      "http://jeremymark.ca:3001/generatereceipt?departureflightids=[1,2,3]&returnflightids=[8]&name=" +
        nameValue +
        "&email=" +
        emailValue
    )
      .then((response) => response.json())
      .then((json) => {
        // Redirect to the new page with the fetched data
        console.log(json);
        navigate("/receipt", { state: { data: json } });
      })
      .catch((error) => console.error(error));
  };

  const departData = location.state?.departPaths;
  const returnData = location.state?.returnPaths;
  console.log(departData[1][0].order);

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col w-full p-20 gap-20 items-center">
        <div className="flex flex-col items-center">
          <h1 className=" text-black text-5xl font-extrabold leading-10">
            Departure Flights
          </h1>

          <div className="mt-5 flex flex-col justify-center items-start p-5 gap-10">
            <h3 className="text-black text-2xl font-semibold leading-8">
              Departure Flights <br /> A &rarr; B
            </h3>

            <fieldset className="flex flex-col gap-5" name="departures">
              {departData.map((flight) => (
                <Flight
                  flightID={flight[0].flightid}
                  planeName={flight[0].planename}
                  departureTime={convertToTime(flight[0].departtime)}
                  arrivalTime={convertToTime(flight[0].arrivetime)}
                />
              ))}
            </fieldset>
          </div>
        </div>

        {/* ------------------------------------------------------ */}
        <hr className="text-black w-9/12 " />

        <div className="flex flex-col items-center">
          <h1 className=" text-black text-5xl font-extrabold leading-10">
            Return Flights
          </h1>

          <div className="mt-5 flex flex-col justify-center items-start p-5 gap-10">
            <h3 className="text-black text-2xl font-semibold leading-8">
              Return Flights <br /> B &rarr; A
            </h3>

            <fieldset className="flex flex-col gap-5" name="returns">
              {returnData.map((flight) => (
                <Flight
                  flightID={flight[0].flightid}
                  planeName={flight[0].planename}
                  departureTime={convertToTime(flight[0].departtime)}
                  arrivalTime={convertToTime(flight[0].arrivetime)}
                />
              ))}
            </fieldset>
          </div>
        </div>

        {/* ----------------------- */}
        <hr className="text-black w-9/12 " />
        {/* Checkout: */}
        <div>
          <div className=" flex flex-col p-5 items-center gap-5 ">
            <h3 className=" font-semibold text-black text-2xl">Checkout</h3>
            <div className="flex flex-col">
              <label
                className="block mb-2 text-sm font-medium text-gray-900"
                htmlFor="fullname"
              >
                Full Name:
              </label>
              <input
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                type="text"
                id="fullname"
                required
                value={nameValue}
                onChange={handleNameChange}
              />
            </div>
            <div className="flex flex-col">
              <label
                className="block mb-2 text-sm font-medium text-gray-900"
                htmlFor="email"
              >
                Email:
              </label>
              <input
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                type="email"
                id="email"
                required
                value={emailValue}
                onChange={handleEmailChange}
              />
            </div>

            <button
              type="submit"
              className="bg-black text-white text-lg font-semibold border rounded-xl p-2 w-[200px] hover:bg-gray-600 duration-200"
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default SelectFlight;
