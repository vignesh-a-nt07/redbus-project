import React from "react";
import styles from "./MyTrips.module.css";
import SingleTrip from "./SingleTrip";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const AllBookings = () => {
  const [allBookings, setAllBookings] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    async function fetchAllBookings() {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/v1/api/bookings`
        );
        setAllBookings(res.data);
      } catch (err) {
        setError(err.message || "Unable to load bookings.");
      } finally {
        setLoading(false);
      }
    }
    fetchAllBookings();
  }, []);

  if (loading) {
    return <div className={styles.MyTrips}>Loading all bookings...</div>;
  }

  if (error) {
    return <div className={styles.MyTrips}>Error: {error}</div>;
  }

  if (allBookings.length === 0) {
    return <div className={styles.MyTrips}>No booking records found.</div>;
  }

  return (
    <div className={styles.MyTrips}>
      {allBookings.reverse().map((booking) => (
        <SingleTrip key={uuidv4()} booking={booking} />
      ))}
    </div>
  );
};

export default AllBookings;
