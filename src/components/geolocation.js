import React, { useState, useEffect, Fragment } from "react";
import MapPointer from "./map";
import AddressCard from "./addressCard";

const GeolocationExample = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [address, setAddress] = useState(null);
  const [allDataFetched, setAllDataFetched] = useState(false);
  const [formData, setFormData] = useState({
    lattitude: "",
    longitude: "",
    country: "",
    state: "",
    city: "",
    postalCode: "",
    zone: "",
    ipAddress: "",
  });

  const fields = [
    { name: "lattitude", label: "Lattitude", type: "text", disabled: false },
    { name: "longitude", label: "Longitude", type: "text", disabled: false },
    { name: "country", label: "Country", type: "text", disabled: true },
    { name: "state", label: "State", type: "text", disabled: true },
    { name: "city", label: "City", type: "text", disabled: true },
    { name: "postalCode", label: "Postal Code", type: "text", disabled: true },
    { name: "zone", label: "Zone", type: "text", disabled: true },
    { name: "ipAddress", label: "IP Address", type: "text", disabled: true },
  ];

  const handleInputChange = (event) => {
    setAllDataFetched(false);
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() => {
    const allValuesPresent = Object.values(formData).every((value) => !!value);
    if (allValuesPresent && allDataFetched) {
      saveDataToDb();
    }
  }, [formData]);

  const getLocation = () => {
    setIsLoading(true);
    setAllDataFetched(false);
    setFormData((prevState) => ({
      ...prevState,
      country: "",
      state: "",
      city: "",
      postalCode: "",
      zone: "",
      ipAddress: "",
    }));
    const { lattitude, longitude } = formData;
    if (lattitude && longitude) {
      getAdditionalDetails(parseFloat(lattitude), parseFloat(longitude));
    } else if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData((prevState) => ({
            ...prevState,
            lattitude: latitude.toString(),
            longitude: longitude.toString(),
          }));
          getAdditionalDetails(latitude, longitude);
        },
        (error) => {
          setIsLoading(false);
          if (error.code === error.PERMISSION_DENIED) {
            alert(
              "Geolocation permission denied. Please reset location permission and try again."
            );
          }
        }
      );
    } else {
      setIsLoading(false);
      alert("Geolocation is not supported by this browser.");
    }
    fetchIpAddress();
  };

  const getAdditionalDetails = (lat, lon) => {
    setIsLoading(true);
    fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data?.error) {
          alert("Please enter valid lattitude and longitude values");
          setFormData({});
          return;
        }
        const { address } = data;
        setAddress(address);
        const { country, state, city, postcode, state_district } = address;

        setFormData((prevState) => ({
          ...prevState,
          country: country || "Not Available",
          state: state || "Not Available",
          city: city || "Not Available",
          postalCode: postcode || "Not Available",
          zone: state_district || "Not Available",
        }));
      })
      .catch((error) => {
        console.error("Reverse geocoding error:", error);
      })
      .finally(() => {
        setIsLoading(false);
        setAllDataFetched(true);
      });
  };

  const fetchIpAddress = () => {
    fetch("https://api.ipify.org/?format=json")
      .then((response) => response.json())
      .then((data) => {
        const ipAddress = data.ip;
        setFormData((prevState) => ({
          ...prevState,
          ipAddress: ipAddress || "Not Available",
        }));
      })
      .catch((error) => {
        console.error("Error fetching IP address:", error);
      })
      .finally(() => {
        setIsLoading(false);
        setAllDataFetched(true);
      });
  };

  const saveDataToDb = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/formdata", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log("Form data submitted successfully");
      } else {
        console.error("Failed to submit form data");
      }
    } catch (error) {
      console.error("Error submitting form data:", error);
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center">
        <h3>Geolocation POC</h3>
        <button
          type="button"
          className="btn btn-outline-primary h-100 px-5"
          onClick={getLocation}
        >
          Fetch Location
        </button>
      </div>
      <form className="mt-5">
        {fields.map((field) => (
          <Fragment key={field.name}>
            <hr />
            <div className="row">
              <label htmlFor={field.name} className="form-label col-3">
                {field.label}
              </label>
              <div className="col-4">
                {isLoading ? (
                  <div className="progress h-75">
                    <div
                      className="progress-bar progress-bar-striped progress-bar-animated"
                      role="progressbar"
                      aria-valuenow="100"
                      aria-valuemin="0"
                      aria-valuemax="100"
                      style={{ width: "100%" }}
                    >
                      <span className="fs-6 py-2">Please Wait...</span>
                    </div>
                  </div>
                ) : (
                  <input
                    type={field.type}
                    id={field.name}
                    name={field.name}
                    onChange={handleInputChange}
                    disabled={field.disabled}
                    value={formData[field.name]}
                    className="form-control p-1"
                  />
                )}
              </div>
            </div>
          </Fragment>
        ))}
      </form>

      <AddressCard address={address} loading={isLoading} />

      {formData.lattitude && formData.longitude && (
        <MapPointer
          latitude={formData.lattitude}
          longitude={formData.longitude}
          address={address}
        />
      )}
    </>
  );
};

export default GeolocationExample;
