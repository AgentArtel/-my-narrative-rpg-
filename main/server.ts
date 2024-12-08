import { RpgServer, RpgModule } from '@rpgjs/server'
import VillagerEvent from './events/villager'
import LemonadeShopEvent from './events/lemonade-shop'
import SimpleMap from './worlds/maps/simplemap'
import ArtelIsland from './worlds/maps/Artel-island'

@RpgModule<RpgServer>({
    player: {
        onConnected(player) {
            player.setHitbox(16, 16)
            player.setGraphic('male')
            player.gold = 100 // Give initial gold
            player.changeMap('artel-island') // Start on Artel Island
        }
    },
    maps: [
        SimpleMap,
        ArtelIsland
    ],
    events: [
        VillagerEvent,
        LemonadeShopEvent
    ]
})
export default class RpgServerEngine {}
