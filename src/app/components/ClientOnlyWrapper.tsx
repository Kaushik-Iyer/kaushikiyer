"use client";

import dynamic from 'next/dynamic';

export const TravelMap = dynamic(() => import('@/app/components/TravelMap'), {
  ssr: false,
  loading: () => <p className="text-center text-gray-500 py-8">Loading map...</p>
});

export const FPLScoreCard = dynamic(() => import('@/app/components/FPLScoreCard'), {
  ssr: false,
  loading: () => <p className="text-center text-gray-500 py-8">Loading FPL Scorecard...</p>
});
