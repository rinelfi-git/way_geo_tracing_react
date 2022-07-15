export default function History({history, onLoadOnMap}) {
    return (
        <div className="card m-2" onClick={onLoadOnMap}>
            <div className="card-content">
                <b>From:</b> {history['departure']}<br />
                <b>To:</b> {history['arrival']}
            </div>
        </div>
    );
}