export default function AvailableDevice({ device, onSaveDevice }) {
    return <div className="card">
        <div className="card-content">
            <div className="content">
                <nav className="level">
                    <div className="level-left">
                        <div className="level-item">
                            <p className="icon is-large">
                                <i className="fa fa-2x fa-compass" aria-hidden="true"></i>
                            </p>
                        </div>
                        <div className="level-item">
                            <div className="content">
                                <p>
                                    <strong>{device.name}</strong> <small>@{device.mac}</small>
                                    <br />
                                    Passphrase: {device.id}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="level-right">
                        <p className="level-item"><button className="button" onClick={() => onSaveDevice(device)}><i className="fa fa-link" aria-hidden="true"></i></button></p>
                    </div>
                </nav>
            </div>
        </div>
    </div>;
}