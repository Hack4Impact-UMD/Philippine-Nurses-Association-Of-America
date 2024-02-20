import { useLocation } from 'react-router-dom';

const MemberDetail = () => {
  //Fetches member data by passed parameter from MemberManagement.jsx
  const location = useLocation();
  const { member } = location.state;

  if (!member) {
    return <div>No member data available.</div>;
  }

  return (
    <div>
      <h1>Member Detail</h1>
      <p>Name: {member.FirstName} {member.LastName}</p>
      <p>ID: {member.id}</p>
      {/* ... Example Fields ... */}
    </div>
  );
};

export default MemberDetail;
