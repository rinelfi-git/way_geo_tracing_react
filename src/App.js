import Map, { Layer, Source } from 'react-map-gl';
import DeviceList from './components/DeviceList';
import io from 'socket.io-client';
import { useEffect, useState } from 'react';
import NewDevice from './components/NewDevice';
import axios from 'axios';
import { BACKEND } from './utils/globals';

function App() {
    const [socket, setSocket] = useState(null);
    const [modalShown, setModalShown] = useState(false);
    const [zooom, setZoom] = useState(false);
    const [lines, setLines] = useState([]);
    const [dataOne, setDataOne] = useState({
        type: "Feature",
        properties: {},
        geometry: {
            type: "LineString",
            coordinates: []
        }
    });

    const MAPBOX_TOKEN = 'pk.eyJ1IjoicmluZWxmaSIsImEiOiJjbDVkZ2RwcHEwNzR4M29yMzRmd2Z1dGtrIn0.TRGmppl_ruIh3dMVAxKWeA';
    const initialViewState = {
        bearing: 0,
        latitude: -18.891447180037076,
        longitude: 44.93077018391659,
        pitch: 0,
        zoom: 5
    };

    useEffect(() => {
        const newSocket = io.connect('http://localhost:5000');
        setSocket(newSocket);
        newSocket.on('connect', () => {
            newSocket.emit('web:register');
        });
        return () => newSocket.close()
    }, [setSocket]);

    async function onLoadOnMap(history) {
        const points = await axios.get(`${BACKEND}/point/latlong/history/${history}`);
        const copy = dataOne;
        copy['geometry']['coordinates'] = [];
        const transformed = points['data'].map(point => { return [parseFloat(point['longitude']['$numberDecimal']), parseFloat(point['latitude']['$numberDecimal']) ]; });
        for(const point of transformed) {
            copy['geometry']['coordinates'].push(point);
        }
        console.log(copy);
        setDataOne(copy);
    }

    return <>
        <Map
            initialViewState={initialViewState}
            mapStyle='mapbox://styles/mapbox/streets-v11'
            style={{
                width: '100vw',
                height: '100vh'
            }}
            mapboxAccessToken={MAPBOX_TOKEN}
            attributionControl={false}
        >
            <Source type="geojson" data={dataOne}>
                <Layer
                    type="line"
                    layout={{
                        "line-join": "round",
                        "line-cap": "round"
                    }}
                    paint={{
                        "line-color": "red",
                        "line-width": 5
                    }}
                />
            </Source>
        </Map>
        <DeviceList socket={socket} onAddNewDevice={() => setModalShown(true)} onLoadOnMap={onLoadOnMap} />
        <NewDevice socket={socket} modalShown={modalShown} onCloseModal={() => setModalShown(false)} />
    </>;
}

export default App;
