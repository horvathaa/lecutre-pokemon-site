export type SyncTrigger = (conceptName: string, id: string | number) => void

export enum POKEMON_TYPES {
  NORMAL = 1,
  FIRE = 2,
  GRASS = 3,
  WATER = 4,
  ELECTRIC = 6,
  FLYING = 7,
  GHOST = 8,
  POISON = 9,
  PSYCHIC = 10,
  BUG = 11,
  ROCK = 12,
  GROUND = 13,
  FIGHTING = 14,
  ICE = 15,
  DRAGON = 16,
  DARK = 17,
  STEEL = 18,
  FAIRY = 19,
}

export const POKEMON_TYPE_NAME_TO_ID: { [key: string]: number } = {
  Normal: POKEMON_TYPES.NORMAL,
  Fire: POKEMON_TYPES.FIRE,
  Grass: POKEMON_TYPES.GRASS,
  Water: POKEMON_TYPES.WATER,
  Electric: POKEMON_TYPES.ELECTRIC,
  Flying: POKEMON_TYPES.FLYING,
  Ghost: POKEMON_TYPES.GHOST,
  Poison: POKEMON_TYPES.POISON,
  Psychic: POKEMON_TYPES.PSYCHIC,
  Bug: POKEMON_TYPES.BUG,
  Rock: POKEMON_TYPES.ROCK,
  Ground: POKEMON_TYPES.GROUND,
  Fighting: POKEMON_TYPES.FIGHTING,
  Ice: POKEMON_TYPES.ICE,
  Dragon: POKEMON_TYPES.DRAGON,
  Dark: POKEMON_TYPES.DARK,
  Steel: POKEMON_TYPES.STEEL,
  Fairy: POKEMON_TYPES.FAIRY,
}

export const POKEMON_TYPES_SET: Set<POKEMON_TYPES> = new Set(
  Object.values(POKEMON_TYPES).filter((value) => typeof value === 'number'),
)

export const POKEMON_TYPE_ID_TO_NAME: { [key: number]: string } = Object.fromEntries(
  Object.entries(POKEMON_TYPE_NAME_TO_ID).map(([name, id]) => [id, name]),
)
