import axios from "axios";
import { useEffect, useState } from "react";
import AvailableDevice from "./AvailableDevice";

export default function NewDevice({socket, modalShown, onCloseModal}) {
    const [availableDevices, setAvailableDevices] = useState([]);

    useEffect(() => {
        if(socket !== null) {
            socket.on('mobile:available', data => {
                setAvailableDevices(data);
            });
        }
    }, [socket]);

    async function saveDevice(device) {
        const response = await axios.put('http://localhost:5000/device', {mac: device.mac, name: device.name});
        if(response.data.success) {
            socket.emit('web:added_new_device');
        }
    }

    return (
        <div className={`modal${modalShown ? ' is-active' : ''}`}>
            <div className="modal-background" onClick={onCloseModal}></div>
            <div className="modal-card">
                <header className="modal-card-head">
                    <h4 className="modal-card-title">Adding a new device</h4>
                    <button className="delete" aria-label="close" onClick={onCloseModal}></button>
                </header>
                <section className="modal-card-body">
                    {availableDevices.map(availableDevice => <AvailableDevice key={availableDevice['id']} device={availableDevice} onSaveDevice={saveDevice} />)}
                </section>
                <footer className="modal-card-foot">
                </footer>
            </div>
        </div>
    );
}