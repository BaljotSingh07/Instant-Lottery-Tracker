import { doc, getDoc, setDoc } from "firebase/firestore"
import { db } from "./firebase"

export interface ILotteryPackEnding {
    Cost : number,
    Last : number
}

async function getAllLotteryPackEndings(){
    const lotteryData = (await getDoc(doc(db, 'LotterySettings', 'Data'))).data()
    return lotteryData?.Data
}

async function setLotteryPackEndings(lotteryPackEndings: Array<ILotteryPackEnding>){
    return setDoc(doc(db, 'LotterySettings', 'Data'), {Data: lotteryPackEndings})
    .then(() => true)
    .catch(() => false)
}

export {getAllLotteryPackEndings, setLotteryPackEndings}