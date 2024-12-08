import { RpgEvent, EventData, RpgPlayer } from '@rpgjs/server'
import fetch from 'node-fetch'

interface BuildshipResponse {
    response: string;
    annotations: any[];
    threadId: string;
    messages: any[];
    error: null | string;
}

interface ParsedResponse {
    dialogue: string;
    action: {
        type: string;
        item?: {
            id: string;
            name: string;
            price: number;
            effects: {
                hp: number;
                sp: number;
            };
        };
    };
}

@EventData({
    name: 'LEMONADE-SHOP-1',
    hitbox: {
        width: 32,
        height: 16
    }
})
export default class LemonadeShopEvent extends RpgEvent {
    private buildshipEndpoint = 'https://48sote.buildship.run/LEMONADE-SHOP-1'

    onInit() {
        console.log('Initializing Lemonade Shop Event')
        this.setGraphic('female')
        this.setPosition(435, 450)
    }

    private async getBuildshipResponse(context: any): Promise<ParsedResponse> {
        try {
            console.log('Preparing Buildship request...')

            const requestBody = {
                gameState: {
                    playerGold: context.playerGold,
                    playerName: context.playerName,
                    timeOfDay: context.timeOfDay,
                    playerChoice: context.playerChoice
                }
            }

            console.log('Making request to:', this.buildshipEndpoint)
            console.log('Request body:', JSON.stringify(requestBody, null, 2))

            const fetchModule = await import('node-fetch')
            const fetchFunc = fetchModule.default

            const response = await fetchFunc(this.buildshipEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(requestBody)
            })

            console.log('Response status:', response.status)

            if (!response.ok) {
                const errorText = await response.text()
                console.error('API Error:', {
                    status: response.status,
                    text: errorText
                })
                throw new Error('API call failed')
            }

            const buildshipResponse: BuildshipResponse = await response.json()
            console.log('Raw Buildship response:', buildshipResponse)

            // Parse the nested JSON string in the response
            const parsedResponse: ParsedResponse = JSON.parse(buildshipResponse.response)
            console.log('Parsed response:', parsedResponse)

            return parsedResponse

        } catch (error) {
            console.error('Buildship Error:', error)
            throw error
        }
    }

    async onAction(player: RpgPlayer) {
        console.log('Player interacted with Lemonade Shop')
        
        try {
            // Initial greeting
            await player.showText('Welcome to my Lemonade Stand! How can I help you today?', {
                talkWith: this
            })

            // Present choices to the player
            const choice = await player.showChoices('What would you like?', [
                { text: 'Tell me about your lemonade', value: 'info' },
                { text: 'I want to buy some lemonade', value: 'buy' },
                { text: "I'm feeling hot and thirsty", value: 'thirsty' },
                { text: 'Just browsing', value: 'browse' }
            ])

            console.log('Making API call...')
            const response = await this.getBuildshipResponse({
                playerGold: player.gold || 0,
                playerName: player.name || 'Adventurer',
                timeOfDay: new Date().getHours(),
                playerChoice: choice
            })
            console.log('Got parsed response:', response)

            // Show the response dialogue
            await player.showText(response.dialogue, {
                talkWith: this
            })

            // Handle transaction if suggested
            if (response.action.type === 'sell' && response.action.item) {
                const { item } = response.action;

                if (player.gold < item.price) {
                    await player.showText("Sorry, you don't have enough gold!", {
                        talkWith: this
                    })
                    return
                }

                // Ask for confirmation
                const confirmChoice = await player.showChoices(`Would you like to buy ${item.name} for ${item.price} gold?`, [
                    { text: 'Yes, please!', value: 'yes' },
                    { text: 'No, thanks', value: 'no' }
                ])

                if (confirmChoice.value === 'yes') {
                    // Process transaction
                    player.gold -= item.price
                    player.addItem({
                        id: item.id,
                        name: item.name,
                        description: `A refreshing ${item.name.toLowerCase()}`,
                        price: item.price,
                        effects: item.effects,
                        consumable: true
                    })

                    await player.showText(`Thank you for buying ${item.name}! Enjoy your drink!`, {
                        talkWith: this
                    })
                }
            }

        } catch (error) {
            console.error('Shop error:', error)
            await player.showText('Sorry, the shop is closed right now!', {
                talkWith: this
            })
        }
    }
}
