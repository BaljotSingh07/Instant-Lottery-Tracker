import { IonHeader, IonToolbar, IonButton, IonTitle, IonContent, IonNote, IonList, IonItem, IonCard, IonImg, IonCardHeader, IonCardTitle, IonCardSubtitle, IonListHeader, IonSearchbar, IonThumbnail  } from "@ionic/react"
import { useEffect, useState } from "react"
import { ILottery } from "../functions/functions"
import { getAllLottries, ILotterySelect } from "../functions/function_lottries"

interface ILotteryView{
    ondissmiss: (newLottery: ILottery | undefined) => any,
}

const Lottries: React.FC<ILotteryView> = ({ondissmiss}) => {
    const [lottries, setLottries] = useState<ILotterySelect[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<String | undefined | null>("")

    useEffect(() => {
        setLottries(getAllLottries())
    },[])
    

    return (
        <>
        <IonHeader>
        <IonToolbar>
          <IonButton onClick={() => {ondissmiss(undefined)}} slot='end' size={'small'} color={'danger'} fill={'clear'}>Cancel</IonButton>
          <IonTitle>Lottries</IonTitle>
        </IonToolbar>
        <IonToolbar>
          <IonSearchbar onIonChange={(e) => setFilter(e.target.value)}></IonSearchbar>
        </IonToolbar>
      </IonHeader>
      <IonContent >
         <IonList>
            {lottries.map((e,i) => 
            <IonItem key={i} detail onClick={() => {ondissmiss({cost: e.cost, cur: 0, name: e.name, prev: 0, sale: 0})}}>
                <IonCard>
                    <IonImg src={e.img}></IonImg>
                    <IonCardHeader>
                        <IonCardSubtitle>${e.cost}</IonCardSubtitle>
                        <IonCardTitle>{e.name}</IonCardTitle>
                    </IonCardHeader>
                </IonCard>
            </IonItem>
            )}
         </IonList>
      </IonContent>
  </>
    )
}

export default Lottries