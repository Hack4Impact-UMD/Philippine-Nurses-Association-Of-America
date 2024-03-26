import React, { useEffect, useState } from 'react';

const Members = () => {
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch('https://us-central1-pnaa-8b56f.cloudfunctions.net/WildApricotApi/api/members');
        if (!response.ok) {
          throw new Error('Failed to fetch members');
        }
        const data = await response.json();
        console.log("DATA", data);
        setMembers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMembers();
  }, []);

  if (isLoading) {
    return <div>Fetching data from Wild Apricot's database...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <p>*Note: Changes to Wild Apricot will take ~ 5 min to be reflected.</p>
      <p>*Note: 40 requests per minute limit.</p>
      <h1>Members</h1>
      <ul>
        {members && members.map((member, index) => (
          <li key={index}>
            <h2>{member.DisplayName}</h2>
            <p>Organization: {member.Organization || 'N/A'}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Members;
