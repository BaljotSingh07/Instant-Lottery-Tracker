import dayjs from 'dayjs'

export type ILottery = {
    name: string,
    prev : number,
    cur : number,
    sale : number,
    cost : number
} | null
  
export interface ISummary{
    lotto: number,
    online: number,
    total : number
}

export interface IShift{
    date : dayjs.Dayjs,
    lottos : Array<ILottery>
    summaray : ISummary,
    notes: string
}

export interface IHistory extends ISummary{
    date: dayjs.Dayjs,
    notes: string
}

interface IMockDatabase{
    data : Array<IShift>
}

const mockDatabase:IMockDatabase = {
data : [
    {
    date : dayjs('2022-10-30'),
    lottos : [{name: "Blackjack", cost : 1, cur: 10, prev: 0, sale: 10}, 
            {name: "Holiday", cost : 2, cur: 5, prev: 0, sale: 10}, 
            null, 
            {name: "Packers", cost : 3, cur: 3, prev: 0, sale: 9}, 
        ],
    summaray : {
        lotto: 29,
        online: 10,
        total: 39
    },
    notes: "Some notes"
    },
    {
        date : dayjs('2022-10-29'),
        lottos : [{name: "Blackjack", cost : 1, cur: 10, prev: 10, sale: 0}, 
                {name: "Holiday", cost : 2, cur: 5, prev: 5, sale: 0}, 
                {name: "Packers", cost : 3, cur: 3, prev: 3, sale: 0}
            ],
        summaray : {
            lotto: 0,
            online: 0,
            total: 0
        },
        notes: "Some notes"
        }
]
}

export function getPrevShiftByDate(date: dayjs.Dayjs) : IShift{
    const previousDate = date.subtract(1,'day')
    let shift = mockDatabase.data.find(e => e.date.isSame(previousDate, 'day'))
    if(shift){
        const newShift:IShift = {date: date, summaray: {lotto: 0, online: 0, total: 0}, notes: "Cash: $", lottos: []}
        shift.lottos.forEach(e => {
            if(!e){
                newShift.lottos.push(null)
            }else{
            newShift.lottos.push({name: e.name, cost: e.cost, cur: e.cur, prev: e.cur, sale: 0})
            }
        })
        return newShift
    }else{
        shift = {date: date, lottos: [], notes: 'Cash : $', summaray: {lotto: 0, online: 0, total: 0}}
        return shift
    }

}

export function getShiftByDate(date: dayjs.Dayjs) : IShift | undefined{
    const shift : IShift | undefined = mockDatabase.data.find(obj => {
        return obj.date.isSame(date)
    })
    return shift
}

export function setShiftByDate(date: dayjs.Dayjs, newShift : IShift) : boolean {
    let shift = getShiftByDate(date)

    if(shift){
        shift.lottos = newShift.lottos
        shift.summaray = newShift.summaray
        shift.notes = newShift.notes
    }else{
        mockDatabase.data.unshift(newShift)
    }   
    return true
}

export function updateOnlineByDate(date: dayjs.Dayjs, newSale : number) : IHistory | false{
    const shift = getShiftByDate(date)
    if(shift){
        shift.summaray.online = newSale
        shift.summaray.total = shift.summaray.lotto + newSale
        return {...shift.summaray, notes: shift.notes, date: shift.date}
    }
    return false
}

export function getHistory() : Array<IHistory>{
    const returnVal : Array<IHistory> = []
    mockDatabase.data.forEach(e => {
        returnVal.push({date: e.date, lotto: e.summaray.lotto, online: e.summaray.online, total: e.summaray.total, notes: e.notes})
    })
    return returnVal
}

export function printMockDatabase(){
    console.log(mockDatabase)
}
