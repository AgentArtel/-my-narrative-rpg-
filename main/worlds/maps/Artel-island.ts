import { MapData } from '@rpgjs/server'
import LemonadeShopEvent from '../../events/lemonade-shop'

@MapData({
    id: 'artel-island',
    file: require('./Artel-island.tmx'),
    events: [
        LemonadeShopEvent
    ]
})
export default class ArtelIsland {}
