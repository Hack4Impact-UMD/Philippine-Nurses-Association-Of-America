import React, { useState, useEffect } from "react";
import { useUser } from "../../config/UserContext";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase.ts";
import { Link, useNavigate } from "react-router-dom";

const Events = () => {
  const { currentUser, loading: userLoading } = useUser();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      const eventsCol = collection(db, "events");
      try {
        const snapshot = await getDocs(eventsCol);
        const eventsList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEvents(eventsList);
      } catch (error) {
        console.log("Error getting documents: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [currentUser]);

  const handleAddEvent = () => {
    navigate("/chapter-dashboard/event-details", { state: { event: null } });
  };

  if (userLoading || loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Events Page</h1>
      <button onClick={handleAddEvent}>Add Event</button>
      <ul>
        {events.map((event) => (
          <li key={event.id}>
            <Link
              to={"/chapter-dashboard/event-details"}
              state={{
                event: { ...event, archived: event.archived ?? false },
              }}
            >
              {event.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Events;
