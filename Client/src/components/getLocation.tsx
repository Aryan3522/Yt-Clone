import React, { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "sonner";

interface Props {
  email: string;
}

const GetLocationAndLogin: React.FC<Props> = ({ email }) => {
  const [geocodeData, setGeocodeData] = useState<any>(null);
  const [lastGeoRequest, setLastGeoRequest] = useState<number>(0);

  const LAST_GEO_REQUEST_KEY = "lastGeoRequestTimestamp";

  const fetchGeocode = async (latitude: number, longitude: number) => {
    const now = Date.now();
    const lastRequestStr = localStorage.getItem(LAST_GEO_REQUEST_KEY);
    const lastRequest = lastRequestStr ? parseInt(lastRequestStr, 10) : 0;

    if (now - lastRequest < 60000) {
      console.log("Throttled: Wait 1 minute between requests");
      toast("User location for comment will fetch after 1 minute!!");
      return;
    }

    localStorage.setItem(LAST_GEO_REQUEST_KEY, now.toString());

    try {
      const res = await axiosInstance.get("/location/geocode", {
        params: { lat: latitude, lon: longitude },
      });
      setGeocodeData(res.data);
    } catch (err) {
      console.error("Failed to fetch geocode:", err);
    }
  };

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          axiosInstance.post("/location/getlocation", {
            email,
            location: { latitude, longitude },
          });
          fetchGeocode(latitude, longitude);
        },
        () => {
          axiosInstance.post("/location/getlocation", { email });
        }
      );
    } else {
      axiosInstance.post("/location/getlocation", { email });
    }
  }, [email]);

  return (
    <div>
      {geocodeData ? (
        <div>
          <div className="loc_cont flex flex-row cursor-default bg-transparent pl-2 pr-2 overflow-auto">
            <pre>
              {JSON.stringify(geocodeData.address?.state || "Location").replace(/^"|"$/g, "")}
            </pre>
            <pre>, </pre>
            <pre>{JSON.stringify(geocodeData.address?.country, null, 2).replace(/^"|"$/g, "")}</pre>
          </div>
          <pre className="hidden loc_cont:hover:flex">
            {JSON.stringify(geocodeData.display_name, null, 2)}
          </pre>
        </div>
      ) : (
        <div>Getting location...</div>
      )}
    </div>
  );
};

export default GetLocationAndLogin;
