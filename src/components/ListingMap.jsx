import React from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
export default function ListingMap({lat, lng, popup}) {
    return (
        <div className='h-[50vh] md:h-[70vh] w-full'>
            <MapContainer style={{height: '100%', width: '100%'}} center={[lat, lng]} zoom={13} scrollWheelZoom={false}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[lat, lng]}>
                    <Popup>
                        {popup}
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    )
}
