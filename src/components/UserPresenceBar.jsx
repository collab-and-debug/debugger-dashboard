function UserPresenceBar({ users }) {
  return (
    <div style={{ display: 'flex', gap: '12px', padding: '10px' }}>
      {users.map((user) => (
        <div key={user.userName} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: user.color,
            }}
          />
          <span>{user.userName}</span>
        </div>
      ))}
    </div>
  );
}

export default UserPresenceBar;