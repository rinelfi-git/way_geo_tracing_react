import axios from "axios";
import { useEffect, useState } from "react";
import History from "./History";
import { BACKEND } from "../utils/globals";

export default function Device({ socket, device, onDelete, onLoadOnMap }) {
    const [detailShowed, setDetailShowed] = useState(false);
    const [histories, setHistories] = useState([]);

    useEffect(() => {
        if(socket != null) {
            socket.on(`mobile:history_sync_done_${device['mac']}`, () => {
                axios.get(`${BACKEND}/history/device/${device['_id']}`).then(response => {
                    setHistories([...histories, response.data]);
                });
            });
        }
    }, [socket]);

    useEffect(async () => {
        if(detailShowed && histories.length === 0) {
            const {data} = await axios.get(`${BACKEND}/history/device/${device['_id']}`);
            setHistories(data);
        }
    }, [detailShowed]);

    return (
        <div className="p-1 pl-2 pr-2 device">
            <div className="card">
                <header className="card-header">
                    <p className="card-header-title">
                        {device.name}
                    </p>
                    <button className="card-header-icon" type="button" onClick={() => onDelete(device['_id'])}>
                        <span className="icon">
                            <i className='fa fa-trash' aria-hidden="true"></i>
                        </span>
                    </button>
                    <button className="card-header-icon" type="button" aria-label="more options" onClick={() => setDetailShowed(!detailShowed)}>
                        <span className="icon">
                            <i className={`fa ${detailShowed ? 'fa-angle-up' : 'fa-angle-down'}`} aria-hidden="true"></i>
                        </span>
                    </button>
                </header>
                <div className="card-content" style={{ display: detailShowed ? 'block' : 'none' }}>
                    {histories.map(history => <History key={history['_id']} history={history} onLoadOnMap={() => onLoadOnMap(history['id'])} />)}
                </div>
            </div>
        </div>
    );
}