// src/app/components/TravelMap.tsx
'use client'

import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from 'react-leaflet';
import L, { LatLngExpression, GeoJSON as LeafletGeoJSON } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Feature, FeatureCollection, Geometry } from 'geojson'; // Added import
import type { VisitedPlace } from '@/lib/types';

// Define the expected properties for our GeoJSON features
interface CustomFeatureProperties {
  iso_a2: string;
  admin: string;
  // Add any other specific properties you expect from your custom.geo.json
}

// Default map center and zoom
const defaultCenter: LatLngExpression = [20, 0]; // Centered more globally
const defaultZoom = 2;

const geoJsonUrl = '/custom.geo.json'; // Using local custom GeoJSON

const TravelMap: React.FC = () => {
  const [visitedPlaces, setVisitedPlaces] = useState<VisitedPlace[]>([]);
  // Updated geoJsonData state to use standard FeatureCollection type
  const [geoJsonData, setGeoJsonData] = useState<FeatureCollection<Geometry, CustomFeatureProperties> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const geoJsonLayerRef = useRef<LeafletGeoJSON | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [placesResponse, geoResponse] = await Promise.all([
          fetch('/api/admin/visitedPlaces'),
          fetch(geoJsonUrl)
        ]);

        if (!placesResponse.ok) {
          throw new Error(`Failed to fetch visited places: ${placesResponse.statusText}`);
        }
        if (!geoResponse.ok) {
          throw new Error(`Failed to fetch GeoJSON: ${geoResponse.statusText}`);
        }
        
        const placesData = await placesResponse.json();
        const geoData = await geoResponse.json();

        console.log("Fetched visited places:", placesData);
        console.log("Fetched GeoJSON data for map.");
        
        // Log places with coordinates for debugging
        const placesWithCoords = placesData.filter((p: VisitedPlace) => p.latitude && p.longitude);
        console.log("Places with coordinates:", placesWithCoords);

        setVisitedPlaces(placesData || []);
        setGeoJsonData(geoData);

      } catch (err: unknown) {
        console.error("Failed to load map data:", err);
        setError(`Failed to load map data: ${err instanceof Error ? err.message : 'Unknown error'}`);
        setVisitedPlaces([]);
        setGeoJsonData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const visitedCountryCodes = visitedPlaces.map(place => place.countryCode);

  // Updated geoJsonStyle to use standard Feature type and allow for optional feature parameter
  const geoJsonStyle = (feature?: Feature<Geometry, CustomFeatureProperties>) => {
    if (!feature || !feature.properties) return {}; 
    const countryCode = feature.properties.iso_a2; 
    const isVisited = visitedCountryCodes.includes(countryCode);
    return {
      fillColor: isVisited ? '#4F46E5' : '#D1D5DB',
      weight: 1,
      opacity: 1,
      color: 'white', // Border color
      fillOpacity: 0.7
    };
  };

  // Updated onEachFeature to use standard Feature type
  const onEachFeature = (feature: Feature<Geometry, CustomFeatureProperties>, layer: L.Layer) => {
    if (feature.properties && feature.properties.admin) {
      const countryName = feature.properties.admin;
      const countryCode = feature.properties.iso_a2;
      const isVisited = visitedCountryCodes.includes(countryCode);
      const tooltipContent = `${countryName}${isVisited ? ' (Visited)' : ''}`;
      layer.bindTooltip(tooltipContent);

      // Optional: Add click handler or other interactions
      // layer.on({
      //   click: () => console.log(`${countryName} clicked`)
      // });
    }
  };

  // This is to ensure Leaflet icons work correctly with Next.js/Webpack
  useEffect(() => {
    // Use a type assertion that preserves type safety while allowing the delete operation
    delete (L.Icon.Default.prototype as { _getIconUrl?: () => string })._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500 py-8">Loading map...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 py-8">{error}</p>;
  }

  if (typeof window === 'undefined' || !geoJsonData) {
    // Don't render map server-side or if GeoJSON isn't loaded
    return <p className="text-center text-gray-500 py-8">Preparing map...</p>;
  }

  return (
    <MapContainer 
      center={defaultCenter} 
      zoom={defaultZoom} 
      style={{ height: '500px', width: '100%' }} 
      className="border border-gray-300 rounded-lg shadow-md bg-gray-100"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png" // Using CartoDB light tiles without labels
      />
      {geoJsonData && (
        <GeoJSON
          ref={geoJsonLayerRef}
          data={geoJsonData} // No 'as any'
          style={geoJsonStyle}
          onEachFeature={onEachFeature}
        />
      )}
      
      {/* City markers for places with coordinates */}
      {visitedPlaces
        .filter(place => {
          const hasCoords = place.latitude && place.longitude;
          if (hasCoords) {
            console.log(`Rendering marker for ${place.city || place.countryName} at [${place.latitude}, ${place.longitude}]`);
          }
          return hasCoords;
        })
        .map(place => (
          <Marker 
            key={place.id} 
            position={[place.latitude!, place.longitude!]}
          >
            <Popup>
              <div className="text-center">
                <h3 className="font-semibold text-lg mb-2">
                  {place.city || place.countryName}
                </h3>
                {place.cityImage && (
                  <img 
                    src={place.cityImage} 
                    alt={place.city || place.countryName}
                    className="w-48 h-32 object-cover rounded mb-2"
                  />
                )}
                {place.notes && (
                  <p className="text-sm text-gray-700 max-w-xs">
                    {place.notes}
                  </p>
                )}
                {place.dateVisited && (
                  <p className="text-xs text-gray-500 mt-2">
                    Visited: {new Date(place.dateVisited).toLocaleDateString()}
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
    </MapContainer>
  );
};

export default TravelMap;
