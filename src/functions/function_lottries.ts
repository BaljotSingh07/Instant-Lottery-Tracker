export interface ILotterySelect{
    img: string,
    cost: number,
    name: string
}

const mockLottries:ILotterySelect[]= [
    {name: "CHILLIN'", cost: 1, img: 'https://www.wilottery.com/sites/default/files/styles/ig_thumb_640w/public/2022-08/wi-lottery-scratch-game-2476-chillin-penguin.png?itok=Y3NtxTvh'},
    {name: "TWENTY-ONE", cost: 1, img: 'https://www.wilottery.com/sites/default/files/styles/ig_thumb_640w/public/2021-12/wi-lottery-scratch-game-2427-twenty-one.png?itok=M26_r-M9'},
    {name: 'LOTS OF 100s', cost: 2, img: 'https://www.wilottery.com/sites/default/files/styles/ig_thumb_640w/public/2022-09/wi-lottery-scratch-game-2442-lots-of-100s.png?itok=zw3pmvMm'},
    {name: 'TIMES TEN', cost: 2, img: 'https://www.wilottery.com/sites/default/files/styles/ig_thumb_640w/public/2022-03/wi-lottery-scratch-game-2438-times-ten.png?itok=cikU_suk'},
    {name: 'LUCKY CHARM SLINGO', cost: 3, img: 'https://www.wilottery.com/sites/default/files/styles/ig_thumb_640w/public/2022-06/wi-lottery-scratch-game-2451-lucky-charm-slingo.png?itok=BXorvBun'},
    {name: 'BADGER STATE CROSSWORD', cost: 5, img: 'https://www.wilottery.com/sites/default/files/styles/ig_thumb_640w/public/2022-04/wi-lottery-scratch-game-2409-badger-state-crossword.png?itok=hY4y3SjQ'},
    {name: 'INCREDIBLE', cost: 10, img: 'https://www.wilottery.com/sites/default/files/styles/ig_thumb_640w/public/2022-04/wi-lottery-scratch-game-2465-incredible-crossword.png?itok=MGE9lNHI'}
]

export function getAllLottries() : ILotterySelect[]{
    return mockLottries
}