// Define a type for the synchronization trigger function

import { POKEMON_TYPE_ID_TO_NAME, POKEMON_TYPES, type SyncTrigger } from '../helpers'

// ITypeState - The state maintained by a single instance of the Type concept
interface ITypeState {
  id: number
  name: string
  colorHex: string // A hex color for UI representation
  // Key: ID of the defending Type, Value: Damage multiplier (0, 0.5, 1, 2)
  damageRelations: Map<number, number>
}

// TypeConcept - The backend service/implementation of the Type concept
class TypeConcept {
  // Simulates a database table for Type instances
  private types: Map<number, ITypeState> = new Map()
  private nextId: number = 1 // Used if IDs are not explicitly provided
  private syncTrigger: SyncTrigger // Link to the global synchronization engine

  constructor(syncTrigger: SyncTrigger) {
    this.syncTrigger = syncTrigger

    // Seed with some common types and their basic relations for demonstration
    // Note: A real implementation would have comprehensive data.
    this.create(
      POKEMON_TYPES.NORMAL,
      POKEMON_TYPE_ID_TO_NAME[POKEMON_TYPES.NORMAL] as string,
      '#A8A878',
      new Map<number, number>([
        [POKEMON_TYPES.GHOST, 0], // Ghost takes 0 damage from Normal
      ]),
    )
    this.create(
      POKEMON_TYPES.FIRE,
      POKEMON_TYPE_ID_TO_NAME[POKEMON_TYPES.FIRE] as string,
      '#F08030',
      new Map<number, number>([
        [POKEMON_TYPES.GRASS, 2], // Grass takes 2x from Fire
        [POKEMON_TYPES.WATER, 0.5], // Water takes 0.5x from Fire
      ]),
    )
    this.create(
      POKEMON_TYPES.GRASS,
      POKEMON_TYPE_ID_TO_NAME[POKEMON_TYPES.GRASS] as string,
      '#78C850',
      new Map<number, number>([
        [POKEMON_TYPES.FIRE, 0.5], // Fire takes 0.5x from Grass
        [POKEMON_TYPES.WATER, 2], // Water takes 2x from Grass
      ]),
    )
    this.create(
      POKEMON_TYPES.WATER,
      POKEMON_TYPE_ID_TO_NAME[POKEMON_TYPES.WATER] as string,
      '#6890F0',
      new Map<number, number>([
        [POKEMON_TYPES.FIRE, 2], // Fire takes 2x from Water
        [POKEMON_TYPES.GRASS, 0.5], // Grass takes 0.5x from Water
      ]),
    )
    this.create(
      POKEMON_TYPES.ELECTRIC,
      POKEMON_TYPE_ID_TO_NAME[POKEMON_TYPES.ELECTRIC] as string,
      '#F8D030',
      new Map<number, number>([
        [POKEMON_TYPES.WATER, 2], // Water takes 2x from Electric
      ]),
    )
    this.create(
      POKEMON_TYPES.FLYING,
      POKEMON_TYPE_ID_TO_NAME[POKEMON_TYPES.FLYING] as string,
      '#A890F0',
      new Map<number, number>([
        [POKEMON_TYPES.GRASS, 2], // Grass takes 2x from Flying
        [POKEMON_TYPES.ELECTRIC, 0.5], // Electric takes 0.5x from Flying
        [POKEMON_TYPES.ROCK, 0.5], // Rock takes 0.5x from Flying
        [POKEMON_TYPES.FIGHTING, 2], // Fighting takes 2x from Flying
      ]),
    )
    this.create(
      POKEMON_TYPES.GHOST,
      POKEMON_TYPE_ID_TO_NAME[POKEMON_TYPES.GHOST] as string,
      '#705898',
      new Map<number, number>([
        [POKEMON_TYPES.NORMAL, 0], // Normal takes 0 damage from Ghost
      ]),
    )
    this.create(
      POKEMON_TYPES.POISON,
      POKEMON_TYPE_ID_TO_NAME[POKEMON_TYPES.POISON] as string,
      '#A040A0',
      new Map<number, number>([
        [POKEMON_TYPES.GRASS, 2], // Grass takes 2x from Poison
        [POKEMON_TYPES.POISON, 0.5], // Poison takes 0.5x from Poison
        [POKEMON_TYPES.GROUND, 0.5], // Ground takes 0.5x from Poison
        [POKEMON_TYPES.ROCK, 0.5], // Rock takes 0.5x from Poison
        [POKEMON_TYPES.GHOST, 0.5], // Ghost takes 0.5x from Poison
      ]),
    )
  }

  /**
   * User-facing Action: `Type.view(type_id)`
   * Retrieves the complete state of a Pokémon type.
   * @param typeId The unique identifier of the type.
   * @returns The ITypeState or null if not found.
   */
  public view(typeId: number): ITypeState | null {
    console.log(`[TypeConcept.view] Request to view type ID: ${typeId}`)
    const type = this.types.get(typeId)
    if (!type) {
      console.warn(`[TypeConcept.view] Type with ID ${typeId} not found.`)
    }
    // Return a copy to prevent external modification of the concept's internal state
    return type ? { ...type, damageRelations: new Map(type.damageRelations) } : null
  }

  /**
   * Administrative Action: `Type.create(...)`
   * Creates a new Pokémon type.
   * @param id Optional ID (for seeding/pre-defined types), otherwise auto-generated.
   * @param name The name of the type.
   * @param colorHex The hex color representation for UI.
   * @param damageRelations A map of damage multipliers against other types.
   * @returns The created ITypeState.
   */
  public create(
    id: number | null,
    name: string,
    colorHex: string,
    damageRelations: Map<number, number>,
  ): ITypeState {
    const typeId = id === null ? this.nextId++ : id
    if (this.types.has(typeId)) {
      throw new Error(`Type with ID ${typeId} already exists.`)
    }
    const newState: ITypeState = { id: typeId, name, colorHex, damageRelations }
    this.types.set(typeId, newState)
    console.log(`[TypeConcept.create] Created type: ${name} (ID: ${typeId})`)
    this.data_updated(typeId) // Trigger output action for sync engine
    return { ...newState, damageRelations: new Map(newState.damageRelations) }
  }

  /**
   * Administrative Action: `Type.update(...)`
   * Modifies an existing Pokémon type.
   * @param typeId The ID of the type to update.
   * @param updates An object containing partial updates for the type state.
   * @returns The updated ITypeState or null if not found.
   */
  public update(typeId: number, updates: Partial<Omit<ITypeState, 'id'>>): ITypeState | null {
    const type = this.types.get(typeId)
    if (!type) {
      console.warn(`[TypeConcept.update] Type with ID ${typeId} not found.`)
      return null
    }
    const updatedType = { ...type, ...updates }
    if (updates.damageRelations) {
      // Merge existing and new damage relations
      updatedType.damageRelations = new Map([...type.damageRelations, ...updates.damageRelations])
    }
    this.types.set(typeId, updatedType)
    console.log(`[TypeConcept.update] Updated type ID: ${typeId}`)
    this.data_updated(typeId) // Trigger output action for sync engine
    return { ...updatedType, damageRelations: new Map(updatedType.damageRelations) }
  }

  /**
   * Output Action: `Type.data_updated(type_id)`
   * Signals that a type's data has been created or modified.
   * This method calls the global `syncTrigger` for the SynchronizationEngine to react.
   * @param typeId The ID of the type that was updated.
   */
  private data_updated(typeId: number): void {
    console.log(`[TypeConcept.data_updated] Type data for ID ${typeId} has been updated.`)
    this.syncTrigger('Type', typeId)
  }

  /**
   * Helper for demo purposes: Get all types.
   */
  public getAllTypes(): ITypeState[] {
    return Array.from(this.types.values()).map((type) => ({
      ...type,
      damageRelations: new Map(type.damageRelations),
    }))
  }
}

export default TypeConcept
