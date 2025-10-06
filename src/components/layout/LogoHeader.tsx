import React from "react";
import HMSLogo from "../../assets/img/HMS_TITLE.png";

const LogoHeader = () => {
  return (
    <div className="w-full h-[70px] bg-[white] shadow-sm flex items-center px-4">
      <div className="max-w-[220px] h-[220px] flex items-center">
        <img
          src={HMSLogo}
          alt="HMS Logo"
          className="w-auto h-full object-contain"
        />
      </div>
    </div>
  );
};

export default LogoHeader;
