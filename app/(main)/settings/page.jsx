
import settings from './settings.module.css';
export default function SettingsPage() {
return (
<div className={settings.container}>
<h1 className={settings.headerTitle}>Settings</h1>


<div className={settings.section}>
<div className={settings.toggleRow}>
<span>Notifications</span>
<input type="checkbox" />
</div>


<div className={settings.toggleRow}>
<span>Location Access</span>
<input type="checkbox" />
</div>


<div className={settings.toggleRow}>
<span>Weather-Based Tips</span>
<input type="checkbox" />
</div>
</div>


<button className={settings.logoutButton}>Logout</button>
</div>
);
}