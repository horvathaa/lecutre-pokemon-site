concept Type [id, name, colorHex]
purpose: To encapsulate and provide the foundational, immutable (or rarely changing) data for
 a single Pokémon elemental type, including its name, visual representation, and battle 
 damage interactions with other types.
principle: For a user, the `Type` concept enables the action of "looking up" or "viewing" the 
properties of a specific type. 

state
    a set of Type with
        an id Number
        a name String
        a colorHex String
    a set of DamageRelationships with
        an otherTypeId Number
        a relationship Number


actions
    createType(id: number, name: string, colorHex: string): Type
        requires: id <= 19 && name in set of TypeNames && colorHex is a legal hex value
        effects: creates internal representation of type
    getTypeMatchup(otherTypeId: number): DamageRelationship
        requires: otherTypeId <= 19
        effects: returns the relationship number between this type and other type
    viewType(): void
        requires: nothing
        effects: displays colorHex and name for Type
