"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardBody } from "@heroui/card";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";

interface Player {
  player_id: number;
  name_first: string;
  name_last: string;
  ioc: string;
}

interface PlayerSearchInputProps {
  onSelectPlayer: (player: Player | null) => void;
  selectedPlayer: Player | null;
  placeholder?: string;
}

export function PlayerSearchInput({
  onSelectPlayer,
  selectedPlayer,
  placeholder,
}: PlayerSearchInputProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Player[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Effect for debouncing the search input and fetching suggestions
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length > 2) {
        setLoading(true);
        try {
          const res = await fetch(`/api/wta/player?search=${searchQuery}`);
          const data: Player[] = await res.json();
          setSearchResults(data);
          setShowResults(true);
        } catch (error) {
          console.error("Failed to fetch players:", error);
          setSearchResults([]);
        } finally {
          setLoading(false);
        }
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 500); // Debounce for 500ms

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  useEffect(() => {
    if (selectedPlayer) {
      setSearchQuery(
        `${selectedPlayer.name_first} ${selectedPlayer.name_last}`,
      );
    } else {
      setSearchQuery("");
    }
  }, [selectedPlayer]);

  const handleSelect = (player: Player) => {
    onSelectPlayer(player);
    setShowResults(false);
  };

  const handleClear = () => {
    setSearchQuery("");
    setSearchResults([]);
    onSelectPlayer(null);
    setShowResults(false);
  };

  return (
    <div className="relative w-full">
      <div className="flex items-center space-x-2">
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder || "Search player..."}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() =>
            searchQuery.length > 2 &&
            searchResults.length > 0 &&
            setShowResults(true)
          }
          onBlur={() => setTimeout(() => setShowResults(false), 100)}
          className="pr-10"
        />
        {selectedPlayer && (
          <Button
            className="bg-linear-to-tr from-pink-500 to-yellow-500 text-white shadow-lg"
            radius="full"
            color="default"
            variant="shadow"
            onPress={handleClear}
          >
            Clear
          </Button>
        )}
      </div>

      {loading && searchQuery.length > 2 && (
        <div className="absolute z-10 w-full rounded-md border bg-popover p-2 shadow-md mt-1">
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      )}

      {showResults && searchResults.length > 0 && (
        <Card className="absolute z-10 w-full mt-1 max-h-60 overflow-y-auto">
          <CardBody className="p-0">
            {searchResults.map((player) => (
              <div
                key={player.player_id}
                className="flex items-center gap-3 p-2 cursor-pointer z-50 bg-gray-600 duration-200 hover:bg-gray-100 hover:text-black"
                // Prevent input blur when clicking on a suggestion
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSelect(player)}
              >
                <Avatar name={player.name_last[0]} className="h-8 w-8"></Avatar>
                <div>
                  <p className="font-medium">
                    {player.name_first} {player.name_last}
                  </p>
                  <p className="text-sm text-muted-foreground">{player.ioc}</p>
                </div>
              </div>
            ))}
          </CardBody>
        </Card>
      )}
    </div>
  );
}
