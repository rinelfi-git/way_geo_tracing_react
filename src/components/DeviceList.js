import { useEffect, useState } from "react";
import Device from "./Device";
import axios from 'axios';

export default function DeviceList({ socket, onAddNewDevice, onLoadOnMap }) {
    const [devices, setDevices] = useState([]);

    async function onDeleteDevice(id) {
        const response = await axios.delete(`http://localhost:5000/device/${id}`);
        if (response.data.success) {
            const clones = devices.slice();
            const find = clones.find(clone => clone['_id'] === id);
            clones.splice(clones.indexOf(find), 1);
            setDevices(clones);
        }
    }

    useEffect(() => {
        axios.get('http://localhost:5000/device').then(response => {
            setDevices(response.data);
        });
    }, []);

    useEffect(() => {
        if (socket != null) {
            socket.on('web:added_new_device', async () => {
                const response = await axios.get('http://localhost:5000/device');
                setDevices(response.data);
            })
        }
    }, [socket]);

    return (
        <div className="card device-list">
            <header className="card-header">
                <p className="card-header-title">
                    <input className="input" type="text" placeholder="Search for device name" />
                </p>
                <button className="card-header-icon" aria-label="more options">
                    <span className="icon" onClick={onAddNewDevice}>
                        <i className="fa fa-plus mr-2" aria-hidden="true"></i>
                    </span>
                    <span className="icon">
                        <i className="fa fa-close" aria-hidden="true"></i>
                    </span>
                </button>
            </header>
            <div className="card-content device-list-content">
                {devices.map(device => <Device key={device['_id']} device={device} onDelete={onDeleteDevice} onLoadOnMap={onLoadOnMap} />)}
            </div>
        </div>
    );
}