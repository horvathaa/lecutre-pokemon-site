import type { SyncTrigger } from '../helpers'

interface IPokemonEntryState {
  id: number // National Pokedex number
  name: string
  description: string
  type_ids: number[] // References to TypeConcept.id
  moveset_ids: number[] // References to MoveConcept.id
  origin_game_id: number // Reference to GameConcept.id
}

// PokemonEntryConcept - The backend service/implementation of the PokemonEntry concept
class PokemonEntryConcept {
  private entries: Map<number, IPokemonEntryState> = new Map()
  private nextId: number = 1 // Can be manually assigned for Pokedex numbers
  private syncTrigger: SyncTrigger

  constructor(syncTrigger: SyncTrigger) {
    this.syncTrigger = syncTrigger

    // Seed with some Pokémon for demonstration.
    // Type IDs: 1-Normal, 2-Fire, 3-Grass, 4-Water, 6-Electric, 7-Flying, 9-Poison
    // Move IDs: 101-Thunderbolt, 102-Quick Attack, 103-Tackle, 104-Growl, 105-Flamethrower, 106-Vine Whip
    // Game IDs: 1001-Red, 1004-Sword
    this.create(
      25,
      'Pikachu',
      "It stores electricity in its cheeks. When it's angry, it discharges electricity from the sacs.",
      [6],
      [101, 102, 103, 104],
      1001,
    ) // Electric, Thunderbolt, Quick Attack, Tackle, Growl, Red
    this.create(
      6,
      'Charizard',
      "It spits fire that is hot enough to melt boulders. It may cause forest fires if it's not careful.",
      [2, 7],
      [105, 102, 103, 104],
      1001,
    ) // Fire/Flying, Flamethrower, Quick Attack, Tackle, Growl, Red
    this.create(
      1,
      'Bulbasaur',
      'A strange seed was planted on its back at birth. The plant sprouts and grows larger as it grows.',
      [3, 9],
      [106, 103, 104],
      1001,
    ) // Grass/Poison, Vine Whip, Tackle, Growl, Red
    this.create(
      493,
      'Arceus',
      'It is said to have emerged from an egg in a vortex of nothingness, then shaped the world with its 1,000 arms.',
      [1],
      [102, 103, 104],
      1004,
    ) // Normal, Quick Attack, Tackle, Growl, Sword
  }

  /**
   * User-facing Action: `PokemonEntry.view(pokemon_id)`
   * Retrieves the complete static information for a specific Pokémon species.
   * @param pokemonId The unique National Pokedex number.
   * @returns The IPokemonEntryState or null if not found.
   */
  public view(pokemonId: number): IPokemonEntryState | null {
    console.log(`[PokemonEntryConcept.view] Request to view Pokémon ID: ${pokemonId}`)
    const entry = this.entries.get(pokemonId)
    if (!entry) {
      console.warn(`[PokemonEntryConcept.view] Pokémon with ID ${pokemonId} not found.`)
    }
    // Return a defensive copy to prevent external modification of internal state
    return entry
      ? { ...entry, type_ids: [...entry.type_ids], moveset_ids: [...entry.moveset_ids] }
      : null
  }

  /**
   * Administrative Action: `PokemonEntry.create(...)`
   * Creates a new Pokémon entry.
   * @returns The created IPokemonEntryState.
   */
  public create(
    id: number,
    name: string,
    description: string,
    type_ids: number[],
    moveset_ids: number[],
    origin_game_id: number,
  ): IPokemonEntryState {
    if (this.entries.has(id)) {
      throw new Error(`PokemonEntry with ID ${id} already exists.`)
    }
    const newState: IPokemonEntryState = {
      id,
      name,
      description,
      type_ids,
      moveset_ids,
      origin_game_id,
    }
    this.entries.set(id, newState)
    console.log(`[PokemonEntryConcept.create] Created Pokémon: ${name} (ID: ${id})`)
    this.data_updated(id) // Trigger output action
    return { ...newState, type_ids: [...newState.type_ids], moveset_ids: [...newState.moveset_ids] }
  }

  /**
   * Administrative Action: `PokemonEntry.update(...)`
   * Modifies an existing Pokémon entry.
   * @returns The updated IPokemonEntryState or null if not found.
   */
  public update(
    pokemonId: number,
    updates: Partial<Omit<IPokemonEntryState, 'id'>>,
  ): IPokemonEntryState | null {
    const entry = this.entries.get(pokemonId)
    if (!entry) {
      console.warn(`[PokemonEntryConcept.update] Pokémon with ID ${pokemonId} not found.`)
      return null
    }
    const updatedEntry = { ...entry, ...updates }
    if (updates.type_ids) updatedEntry.type_ids = [...updates.type_ids]
    if (updates.moveset_ids) updatedEntry.moveset_ids = [...updates.moveset_ids]

    this.entries.set(pokemonId, updatedEntry)
    console.log(`[PokemonEntryConcept.update] Updated Pokémon ID: ${pokemonId}`)
    this.data_updated(pokemonId) // Trigger output action
    return {
      ...updatedEntry,
      type_ids: [...updatedEntry.type_ids],
      moveset_ids: [...updatedEntry.moveset_ids],
    }
  }

  /**
   * Output Action: `PokemonEntry.data_updated(pokemon_id)`
   * Signals that a Pokémon's data has been created or modified.
   * This method calls the global `syncTrigger` for the SynchronizationEngine to react.
   * @param pokemonId The ID of the Pokémon that was updated.
   */
  public data_updated(pokemonId: number): void {
    console.log(
      `[PokemonEntryConcept.data_updated] PokemonEntry data for ID ${pokemonId} has been updated.`,
    )
    this.syncTrigger('PokemonEntry', pokemonId)
  }

  /**
   * Helper for demo purposes: Get all Pokémon entries.
   */
  public getAllPokemonEntries(): IPokemonEntryState[] {
    return Array.from(this.entries.values()).map((entry) => ({
      ...entry,
      type_ids: [...entry.type_ids],
      moveset_ids: [...entry.moveset_ids],
    }))
  }
}

export default PokemonEntryConcept
