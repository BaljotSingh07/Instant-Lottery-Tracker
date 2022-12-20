import { IonPage, IonContent, IonList, IonListHeader, IonItem, IonLabel, IonGrid, IonRow, IonCol, IonInput, IonButton, IonIcon, useIonToast, IonProgressBar } from "@ionic/react"
import { addSharp } from "ionicons/icons"
import { useEffect, useState } from "react"
import MyHeader from "../components/Header"
import { ILotteryPackEnding, getAllLotteryPackEndings, setLotteryPackEndings } from "../functions/functions_lotterypackSettings"

const LotterySetting:React.FC = () => {
    const [endings, setEndings] = useState<ILotteryPackEnding[]>([])
    const [loading, setLoading] = useState(true)
    const [presentSaveToast] = useIonToast()

    function addNewSetting(){
        setEndings([...endings, {Cost: 0, Last: 0}])
    }

    async function getLotteriesEndings(){
        const endings = await getAllLotteryPackEndings()
        setEndings(endings)
        setLoading(false)
    }

    async function save(){
        setLoading(true)
        const saved = await setLotteryPackEndings(endings)
        if(saved){
            presentSaveToast({message: "Saved Lottery Ending", duration: 1000, color: 'success'})
        }else{
            presentSaveToast({message: "Error Saving. Please Try Again.", duration: 1000, color: 'danger'})
        }
        setLoading(false)
    }

    useEffect(() => {
        getLotteriesEndings()
    },[])

    function onCostChange(value: string | undefined| null, index: number){
        if(!value) return

        let intValue = parseInt(value)
        if(Number.isNaN(intValue)) 
            intValue = 0

        const clonedEndings = [...endings]
        clonedEndings[index].Cost = intValue
        setEndings(clonedEndings)
    }

    function onEndingChange(value: string| undefined| null, index: number) {
      if (!value) return;

      let intValue = parseInt(value);
      if (Number.isNaN(intValue)) intValue = 0;

      const clonedEndings = [...endings];
      clonedEndings[index].Last = intValue;
      setEndings(clonedEndings);
    }
    
    return(
        <IonPage id="main-content">
          <MyHeader title="Lottery Settings"/>
          <IonContent>
            <IonList>
                <IonProgressBar hidden={!loading} type="indeterminate"/>
                <IonListHeader>
                    <IonLabel>End Numbers</IonLabel>
                </IonListHeader>
                <IonItem lines="none">
                    <IonLabel><p>Set the ending number of lotteries according to price.</p></IonLabel>
                </IonItem>
                {endings.map((e,i) =>
                <IonItem key={i}>
                    <IonGrid fixed>
                        <IonRow>
                            <IonCol>
                                <IonLabel position="stacked">Cost</IonLabel>
                                <IonInput type="number" onIonChange={(e) => {onCostChange(e.detail.value, i)}} value={e.Cost}></IonInput>
                            </IonCol>
                            <IonCol>
                                <IonLabel position="stacked">Ending Number</IonLabel>
                                <IonInput type="number" onIonChange={(e) => {onEndingChange(e.detail.value, i)}}  value={e.Last}></IonInput>
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                </IonItem>
                )}
                <IonItem >
                    <IonGrid fixed>
                        <IonButton size="small" fill="clear" onClick={addNewSetting} expand="block"><IonIcon icon={addSharp}/>New Slot</IonButton>
                    </IonGrid>
                </IonItem>
                <IonItem lines="none">
                    <IonGrid fixed>
                        <IonButton onClick={save} size="default" expand="block">SAVE</IonButton>
                    </IonGrid>
                </IonItem>
            </IonList>
          </IonContent>
          </IonPage>
    )
}

export default LotterySetting