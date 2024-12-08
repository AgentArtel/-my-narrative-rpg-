import { RpgClient, RpgModule, Direction } from '@rpgjs/client'
import { Spritesheet } from '@rpgjs/client'

const male = require('./spritesheets/characters/hero.png')
const female = require('./spritesheets/characters/female.png')

@Spritesheet({
    id: 'male',
    image: male,
    framesWidth: 4,
    framesHeight: 4,
    width: 128,
    height: 192,
    textures: {
        [Direction.Down]: { line: 0 },
        [Direction.Left]: { line: 1 },
        [Direction.Right]: { line: 2 },
        [Direction.Up]: { line: 3 }
    }
})
class MaleCharacter {}

@Spritesheet({
    id: 'female',
    image: female,
    framesWidth: 4,
    framesHeight: 4,
    width: 128,
    height: 192,
    textures: {
        [Direction.Down]: { line: 0 },
        [Direction.Left]: { line: 1 },
        [Direction.Right]: { line: 2 },
        [Direction.Up]: { line: 3 }
    }
})
class FemaleCharacter {}

@RpgModule<RpgClient>({
    spritesheets: [
        MaleCharacter,
        FemaleCharacter
    ]
})
export default class RpgClientEngine {}
