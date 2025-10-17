**Concept Name:** `PokemonEntry`
*   **Purpose:** To encapsulate and provide the foundational, immutable (or rarely changing) data for a single Pokémon species, intended for display and informational purposes across various applications.
*   **Principle:** For a user, the `PokemonEntry` concept enables the action of "looking up" or "viewing" a specific Pokémon's core details.

### Concept State (`IPokemonEntryState`)

Each instance of the `PokemonEntry` concept represents a single Pokémon species.

*   **`id` (Integer):** The unique National Pokedex number for the Pokémon (e.g., `25` for Pikachu).
*   **`name` (String):** The official English name of the Pokémon (e.g., "Pikachu").
*   **`description` (String):** A concise Pokedex-style lore description of the Pokémon.
*   **`type_ids` (List of Integer):** A list of identifiers referencing instances of the `Type` concept.
*   **`moveset_ids` (List of Integer):** A list of identifiers referencing instances of the `Move` concept, representing a typical or sample moveset.
*   **`origin_game_id` (Integer):** An identifier referencing an instance of the `Game` concept, indicating the primary game (or generation) where the Pokémon was introduced.

### Atomic Actions

*   **`PokemonEntry.view(pokemon_id)`**
    *   requires: pokemon_id <= 1025 // there are only 1025 pokemon
    *   **Human Behavioral Protocol:** "I want to see the details for Pokémon number 25."
    *   **Purpose:** To retrieve all stored static information for a specific Pokémon.
*   **Output Action (Internal/Administrative): `PokemonEntry.data_updated(pokemon_id)`**
    *   **Purpose:** To signal that a Pokémon's data has been created or modified.
*   *(Administrative Actions - not typically direct user interaction for this concept's purpose):*
    *   `PokemonEntry.create(id, name, description, type_ids, moveset_ids, origin_game_id)`
    *   `PokemonEntry.update(pokemon_id, new_name, new_description, ...)`