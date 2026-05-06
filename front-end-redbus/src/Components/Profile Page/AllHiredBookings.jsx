import React from "react";
import styles from "./HiredBuses.module.css";
import SingleHiredBus from "./SingleHiredBus";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const AllHiredBookings = () => {
  const [allBookingsHire, setAllBookingsHire] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    async function fetchAllBookingsHire() {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/v1/api/bookingHires`
        );
        setAllBookingsHire(res.data);
      } catch (err) {
        setError(err.message || "Unable to load hire bookings.");
      } finally {
        setLoading(false);
      }
    }
    fetchAllBookingsHire();
  }, []);

  if (loading) {
    return <div className={styles.HiredBuses}>Loading all hired bookings...</div>;
  }

  if (error) {
    return <div className={styles.HiredBuses}>Error: {error}</div>;
  }

  if (allBookingsHire.length === 0) {
    return <div className={styles.HiredBuses}>No hired booking records found.</div>;
  }

  return (
    <div className={styles.HiredBuses}>
      {allBookingsHire.reverse().map((booking) => (
        <SingleHiredBus key={uuidv4()} booking={booking} />
      ))}
    </div>
  );
};

export default AllHiredBookings;
