"use client";

import { useEffect, useState } from 'react';

// --- Interfaces for FPL API responses ---
interface FPLEvent {
  id: number;
  name: string;
  deadline_time: string;
  average_entry_score: number;
  finished: boolean;
  data_checked: boolean;
  highest_scoring_entry: number | null;
  deadline_time_epoch: number;
  deadline_time_game_offset: number;
  highest_score: number | null;
  is_previous: boolean;
  is_current: boolean;
  is_next: boolean;
  chip_plays: Array<{ chip_name: string; num_played: number }>;
  most_selected: number | null;
  most_transferred_in: number | null;
  top_element: number | null;
  top_element_info: { id: number; points: number } | null;
  transfers_made: number;
  most_captained: number | null;
  most_vice_captained: number | null;
}

interface FPLTeam {
  code: number;
  id: number;
  name: string;
  short_name: string;
  // ... other team properties if needed
}

interface FPLElement { // Player
  id: number;
  web_name: string;
  team: number; // team_id
  element_type: number; // position: 1 GK, 2 DEF, 3 MID, 4 FWD
  event_points: number;
  // ... many other player properties
}

interface FPLBootstrapData {
  events: FPLEvent[];
  teams: FPLTeam[];
  elements: FPLElement[];
  // ... other bootstrap data
}

interface FPLEntryData {
  id: number;
  name: string; // User's FPL team name
  // ... other entry details
}

interface FPLPick {
  element: number; // player_id
  position: number;
  is_captain: boolean;
  is_vice_captain: boolean;
  multiplier: number;
}

interface FPLEntryHistory {
    event: number;
    points: number;
    total_points: number;
    rank: number;
    rank_sort: number;
    overall_rank: number;
    bank: number;
    value: number;
    event_transfers: number;
    event_transfers_cost: number;
    points_on_bench: number;
}

interface FPLPicksData {
  active_chip: string | null;
  automatic_subs: { // Define a more specific type if known, or use unknown[]
    entry: number;
    element_in: number;
    element_out: number;
    event: number;
  }[]; 
  entry_history: FPLEntryHistory;
  picks: FPLPick[];
}

interface FPLFixture {
  id: number;
  event: number; // gameweek id
  finished: boolean;
  started: boolean;
  kickoff_time: string | null;
  team_h: number; // home team id
  team_a: number; // away team id
  // ... other fixture details
}

// --- Component State Interfaces ---
interface PlayerFixtureInfo {
  playerId: number;
  playerName: string;
  kickoff_time: string | null;
  opponent_short_name: string;
  is_home: boolean;
  player_raw_points: number; // Points before multiplier
  played: boolean;
  multiplier: number;
  is_captain: boolean;
  is_vice_captain: boolean;
}

interface FPLScorecardDisplayData {
  teamName: string;
  gameweekPoints: number;
  fixtures: PlayerFixtureInfo[];
  currentGameweekName?: string;
  progressPercentage: number;
  activePlayersCount: number;
  playedMatchesCount: number;
}

const FPLScoreCard = ({ managerId }: { managerId: number }) => {
  const [fplData, setFplData] = useState<FPLScorecardDisplayData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFPLData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Use the proxy for all FPL API calls
        const fetchViaProxy = async (endpoint: string) => {
          const response = await fetch(`/api/fpl-proxy?endpoint=${encodeURIComponent(endpoint)}`);
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.details || `Failed to fetch ${endpoint} via proxy`);
          }
          return response.json();
        };

        const bootstrapData = await fetchViaProxy('bootstrap-static/') as FPLBootstrapData;

        const currentEvent = bootstrapData.events.find((event: FPLEvent) => event.is_current === true);
        if (!currentEvent) throw new Error('Could not determine current gameweek');
        const gameweekId = currentEvent.id;
        const gameweekName = currentEvent.name;

        const entryData = await fetchViaProxy(`entry/${managerId}/`) as FPLEntryData;
        const teamName = entryData.name;

        const picksData = await fetchViaProxy(`entry/${managerId}/event/${gameweekId}/picks/`) as FPLPicksData;
        
        const gameweekPoints = picksData.entry_history.points - picksData.entry_history.event_transfers_cost;

        const currentGameweekFixtures = await fetchViaProxy(`fixtures/?event=${gameweekId}`) as FPLFixture[];

        const processedFixtures: PlayerFixtureInfo[] = [];
        let playedMatchesCount = 0;
        const activePicks = picksData.picks.filter(p => p.multiplier > 0);

        const getTeamShortName = (teamId: number) => {
            const team = bootstrapData.teams.find((t: FPLTeam) => t.id === teamId);
            return team ? team.short_name : 'N/A';
        };
        
        for (const pick of picksData.picks) {
            const playerDetails = bootstrapData.elements.find((el: FPLElement) => el.id === pick.element);
            if (!playerDetails) continue;

            const playerTeamId = playerDetails.team;
            const fixtureForPlayer = currentGameweekFixtures.find((f: FPLFixture) => 
                (f.team_h === playerTeamId || f.team_a === playerTeamId) && f.event === gameweekId
            );

            let opponentShortName = 'N/A';
            let isHome = false;
            let matchPlayed = false;
            let kickoffTime: string | null = null;

            if (fixtureForPlayer) {
                const opponentTeamId = fixtureForPlayer.team_h === playerTeamId ? fixtureForPlayer.team_a : fixtureForPlayer.team_h;
                opponentShortName = getTeamShortName(opponentTeamId);
                isHome = fixtureForPlayer.team_h === playerTeamId;
                matchPlayed = fixtureForPlayer.finished || fixtureForPlayer.started;
                kickoffTime = fixtureForPlayer.kickoff_time;
                if (pick.multiplier > 0 && matchPlayed) {
                    playedMatchesCount++;
                }
            }
            
            processedFixtures.push({
                playerId: playerDetails.id,
                playerName: playerDetails.web_name,
                kickoff_time: kickoffTime,
                opponent_short_name: opponentShortName,
                is_home: isHome,
                player_raw_points: playerDetails.event_points,
                played: matchPlayed,
                multiplier: pick.multiplier,
                is_captain: pick.is_captain,
                is_vice_captain: pick.is_vice_captain,
            });
        }
        
        processedFixtures.sort((a, b) => {
            // Sort by playing status (playing first), then by position (from picksData), then by name
            const aIsPlaying = a.multiplier > 0;
            const bIsPlaying = b.multiplier > 0;
            if (aIsPlaying !== bIsPlaying) return aIsPlaying ? -1 : 1;

            const pickA = picksData.picks.find(p => p.element === a.playerId);
            const pickB = picksData.picks.find(p => p.element === b.playerId);
            if (pickA && pickB && pickA.position !== pickB.position) {
                return pickA.position - pickB.position;
            }
            return a.playerName.localeCompare(b.playerName);
        });
        
        const activePlayersCount = activePicks.length;
        const progressPercentage = activePlayersCount > 0 ? (playedMatchesCount / activePlayersCount) * 100 : 0;

        setFplData({
          teamName,
          gameweekPoints,
          fixtures: processedFixtures,
          currentGameweekName: gameweekName,
          progressPercentage,
          activePlayersCount,
          playedMatchesCount,
        });

      } catch (err: unknown) { // Changed from any to unknown
        console.error("FPL Fetch Error:", err);
        const message = err instanceof Error ? err.message : 'An error occurred while fetching FPL data.';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchFPLData();
  }, [managerId]);

  if (loading) return <div className="p-4 my-6 border border-accent rounded-lg shadow bg-background text-text text-center">Loading FPL Scorecard...</div>;
  if (error) return <div className="p-4 my-6 border border-red-300 bg-red-100 text-red-700 rounded-lg shadow text-center">Error: {error}</div>;
  if (!fplData) return null;

  return (
    <div className="p-4 sm:p-6 border border-accent rounded-lg shadow-lg bg-background text-text">
      <h3 className="text-xl sm:text-2xl font-semibold mb-1 text-primary">{fplData.teamName}</h3>
      {fplData.currentGameweekName && <p className="text-sm text-text/80 mb-3">{fplData.currentGameweekName}</p>}
      <p className="text-3xl font-bold mb-4">{fplData.gameweekPoints} <span className="text-lg font-normal">points</span></p>
      
      {fplData.activePlayersCount > 0 && (
        <div className="mb-4">
          <p className="text-xs sm:text-sm text-text/70 mb-1">
            {fplData.playedMatchesCount} of {fplData.activePlayersCount} active players&apos; matches started/finished.
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div 
              className="bg-primary h-2.5 rounded-full transition-all duration-500 ease-out" 
              style={{ width: `${fplData.progressPercentage}%` }}
            ></div>
          </div>
        </div>
      )}

      <h4 className="text-md sm:text-lg font-semibold mt-6 mb-2 text-text/90">Squad & Live Points:</h4>
      {fplData.fixtures.length > 0 ? (
        <ul className="space-y-2">
          {fplData.fixtures.map((player) => (
            <li 
              key={player.playerId} 
              className={`p-2 sm:p-3 rounded-md border ${player.multiplier === 0 ? 'bg-gray-50 dark:bg-gray-800 opacity-60' : 'bg-background'} border-accent/50`}
            >
              <div className="flex justify-between items-center">
                <div className="flex-grow">
                  <span className={`font-semibold ${player.multiplier === 0 ? 'text-text/70' : 'text-text'}`}>
                    {player.playerName}
                    {player.is_captain && <span className="ml-1 text-xs bg-red-600 text-white px-1.5 py-0.5 rounded-sm">C</span>} {/* Changed bg-primary to bg-red-600 for better light mode visibility */}
                    {player.is_vice_captain && !player.is_captain && <span className="ml-1 text-xs bg-gray-500 text-white px-1.5 py-0.5 rounded-sm">V</span>}
                  </span>
                  {player.kickoff_time && player.multiplier > 0 && (
                    <span className="block sm:inline text-xs text-text/60 sm:ml-2">
                       vs {player.opponent_short_name} ({player.is_home ? 'H' : 'A'})
                    </span>
                  )}
                   {player.multiplier === 0 && <span className="text-xs text-text/60 ml-2">(Bench)</span>}
                </div>
                {player.multiplier > 0 && (
                  <span className={`font-bold text-sm sm:text-base ${player.player_raw_points * player.multiplier > 2 ? 'text-green-500' : (player.player_raw_points * player.multiplier < 0 ? 'text-red-500' : 'text-text/90')}`}>
                    {player.player_raw_points * player.multiplier} pts
                  </span>
                )}
              </div>
              {player.kickoff_time && player.multiplier > 0 && (
                <p className="text-xs text-text/60 mt-1">
                  {new Date(player.kickoff_time).toLocaleString('en-GB', { weekday: 'short', hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}
                  {player.played && <span className="ml-2 text-green-600 dark:text-green-400">(Played)</span>}
                </p>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-text/70">No squad data found for the current gameweek or gameweek hasn&apos;t started.</p>
      )}
    </div>
  );
};

export default FPLScoreCard;
