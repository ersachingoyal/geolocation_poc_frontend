import React from "react";

const AddressCard = ({ address, loading }) => {
    return (
        <div style={{ height: "180px", backgroundColor: "#80808030" }} className="d-flex justify-content-center align-items-center text-center px-3 my-4">
          {!loading ? (
            address && <span>
              {address?.suburb} {address?.city}, {address?.county},{" "}
              {address?.state_district}, {address?.state}, {address?.postcode},{" "}
              {address?.country}
            </span>
          ) : (
            <div className="progress mt-1 h-75 w-100">
              <div
                className="progress-bar progress-bar-striped progress-bar-animated"
                role="progressbar"
                aria-valuenow="100"
                aria-valuemin="0"
                aria-valuemax="100"
                style={{ width: "100%" }}
              >Please Wait...</div>
            </div>
          )}
        </div>
      );      
};

export default AddressCard;
