// import React, { useEffect, useState } from "react";
// import axiosInstance from "@/lib/axiosInstance";
// import { toast } from "sonner";

// interface Props {
//   email: string;
// }

// const GetLocationAndLogin: React.FC<Props> = ({ email }) => {
//   const [geocodeData, setGeocodeData] = useState<any>(null);
//   const [lastGeoRequest, setLastGeoRequest] = useState<number>(0);

//   const LAST_GEO_REQUEST_KEY = "lastGeoRequestTimestamp";

//   const fetchGeocode = async (latitude: number, longitude: number) => {
//     const now = Date.now();
//     const lastRequestStr = localStorage.getItem(LAST_GEO_REQUEST_KEY);
//     const lastRequest = lastRequestStr ? parseInt(lastRequestStr, 10) : 0;

//     if (now - lastRequest < 60000) {
//       console.log("Throttled: Wait 1 minute between requests");
//       toast("User location for comment will fetch after 1 minute!!");
//       return;
//     }

//     localStorage.setItem(LAST_GEO_REQUEST_KEY, now.toString());

//     try {
//       const res = await axiosInstance.get("/location/geocode", {
//         params: { lat: latitude, lon: longitude },
//       });
//       setGeocodeData(res.data);
//     } catch (err) {
//       console.error("Failed to fetch geocode:", err);
//     }
//   };

//   useEffect(() => {
//     if ("geolocation" in navigator) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const { latitude, longitude } = position.coords;
//           axiosInstance.post("/location/getlocation", {
//             email,
//             location: { latitude, longitude },
//           });
//           fetchGeocode(latitude, longitude);
//         },
//         () => {
//           axiosInstance.post("/location/getlocation", { email });
//         }
//       );
//     } else {
//       axiosInstance.post("/location/getlocation", { email });
//     }
//   }, [email]);

//   return (
//     <div>
//       {geocodeData ? (
//         <div>
//           <div className="loc_cont flex flex-row cursor-default bg-transparent pl-2 pr-2 overflow-auto">
//             <pre>
//               {JSON.stringify(geocodeData.address?.state || "Location").replace(/^"|"$/g, "")}
//             </pre>
//             <pre>, </pre>
//             <pre>{JSON.stringify(geocodeData.address?.country, null, 2).replace(/^"|"$/g, "")}</pre>
//           </div>
//           <pre className="hidden loc_cont:hover:flex">
//             {JSON.stringify(geocodeData.display_name, null, 2)}
//           </pre>
//         </div>
//       ) : (
//         <div>Getting location...</div>
//       )}
//     </div>
//   );
// };

// export default GetLocationAndLogin;

// import React, { useEffect, useState } from "react";
// import axiosInstance from "@/lib/axiosInstance";
// import { toast } from "sonner";

// interface Props {
//   email: string;
// }

// const LAST_GEO_REQUEST_KEY = "lastGeoRequestTimestamp";

// const GetLocationAndLogin: React.FC<Props> = ({ email }) => {
//   const [geoData, setGeoData] = useState<any>(null);

//   useEffect(() => {
//     const fetchLocation = async () => {
//       const now = Date.now();
//       // const lastRequestStr = localStorage.getItem(LAST_GEO_REQUEST_KEY);
//       // const lastRequest = lastRequestStr ? parseInt(lastRequestStr, 10) : 0;

//       // if (now - lastRequest < 60000) {
//       //   toast("User location for comment will fetch after 1 minute!!");
//       //   return;
//       // }
//       // localStorage.setItem(LAST_GEO_REQUEST_KEY, now.toString());

//       try {
//         // Use axios (not axiosInstance!) for public IP API because
//         // axiosInstance may have a base URL set for your backend only.
//         const res = await axiosInstance.get(
//           "https://reallyfreegeoip.org/json/",
//           {
//             // Prevents baseURL if set for your local backend
//             baseURL: undefined,
//           }
//         );
//         const data = res.data;
//         setGeoData(data); // Optionally, send the geo data to your backend for storage

//         await axiosInstance.post("/location/getlocation", {
//           email,
//           location: {
//             city: data.city,
//             country: data.country,
//             latitude: data.latitude,
//             longitude: data.longitude,
//             ip: data.ip,
//           },
//         });
//       } catch (err) {
//         console.error("Failed to fetch IP geolocation:", err);
//       }
//     };

//     fetchLocation();
//   }, [email]);

//   return (
//     <div>
//            {" "}
//       {geoData ? (
//         <div className="loc_cont flex flex-row cursor-default bg-transparent pl-2 pr-2 overflow-auto">
//                     <pre>{geoData.city || "Location"}</pre>         {" "}
//           <pre>, </pre>          <pre>{geoData.country}</pre>       {" "}
//         </div>
//       ) : (
//         <div>Getting location...</div>
//       )}
//          {" "}
//     </div>
//   );
// };

// export default GetLocationAndLogin;

import React, { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";

interface Props {
  email: string;
}

const GetLocationAndLogin: React.FC<Props> = ({ email }) => {
  const [geoData, setGeoData] = useState<any>(null);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const res = await axiosInstance.get("/location/geolocation");
        const data = res.data;
        console.log(data);
        setGeoData(data);
      } catch (error) {
        console.error("Failed to fetch IP geolocation:", error);
      }
    };

    fetchLocation();
  }, [email]);

  return (
    <div>
      {geoData ? (
        <div className="loc_cont flex flex-row cursor-default bg-transparent pl-2 pr-2 overflow-auto">
          <span>{geoData.city || "Unknown city"}</span>
          <span>, </span>
          <span>{geoData.country_name || "Unknown country"}</span>
        </div>
      ) : (
        <div>Getting location...</div>
      )}
    </div>
  );
};

export default GetLocationAndLogin;
