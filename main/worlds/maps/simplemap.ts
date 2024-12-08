import { MapData } from '@rpgjs/server'
import VillagerEvent from '../../events/villager'
import LemonadeShopEvent from '../../events/lemonade-shop'

@MapData({
    id: 'simplemap',
    file: require('./simplemap.tmx'),
    events: [
        VillagerEvent,
        LemonadeShopEvent
    ]
})
export default class SimpleMap {}
