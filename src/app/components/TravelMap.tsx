// src/app/components/TravelMap.tsx
'use client'

import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import L, { LatLngExpression, GeoJSON as LeafletGeoJSON } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { client } from '@/sanity/lib/client';
import { Feature, FeatureCollection, Geometry } from 'geojson'; // Added import

// Define the expected properties for our GeoJSON features
interface CustomFeatureProperties {
  iso_a2: string;
  admin: string;
  // Add any other specific properties you expect from your custom.geo.json
}

interface VisitedPlace {
  _id: string;
  countryCode: string; // ISO A2 code, e.g., "US", "JP"
  countryName: string;
  // Optional: Add latitude/longitude if you want to place markers or center map differently
  // latitude?: number;
  // longitude?: number;
}

const VISITED_PLACES_QUERY = `*[_type == "visitedPlace" && defined(countryCode)]{
  _id, countryName, countryCode
}`;

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
        const [placesData, geoResponse] = await Promise.all([
          client.fetch<VisitedPlace[]>(VISITED_PLACES_QUERY),
          fetch(geoJsonUrl)
        ]);

        if (!geoResponse.ok) {
          throw new Error(`Failed to fetch GeoJSON: ${geoResponse.statusText}`);
        }
        const geoData = await geoResponse.json();

        console.log("Fetched visited places:", placesData);
        console.log("Fetched GeoJSON data for map.");

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
    </MapContainer>
  );
};

export default TravelMap;
