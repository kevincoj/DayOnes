export default function SettingsCard() {
  return (
    <div>
      <h2>User Profile</h2>

      <form>
        <div>
          <label>Username</label>
          <input type="text" placeholder="Username" />
        </div>

        <div>
          <label>Email</label>
          <input type="email" placeholder="Email" />
        </div>

        <div>
          <label>Bio</label>
          <textarea placeholder="Tell us about yourself" />
        </div>

        <button type="submit">
          Save Changes
        </button>
      </form>
    </div>
  );
}