import { IonContent, IonHeader, IonBackButton, IonTitle, IonToolbar, IonButtons, IonMenuButton, IonReorder, IonReorderGroup, IonItem, IonLabel, IonGrid, IonRow, IonCol, IonText, IonButton, IonIcon, IonInput, IonList, IonListHeader, IonTextarea, useIonAlert, IonLoading, useIonToast, IonFab, IonFabButton, IonNote, IonModal } from '@ionic/react';
import React, { useEffect, useRef, useState } from 'react';
import { checkmarkSharp, addSharp } from 'ionicons/icons';
import {getShiftByDate, setShiftByDate ,ILottery, ISummary, IHistory, IShift, getPrevShiftByDate} from '../functions/functions';
import dayjs from 'dayjs';
import './Shift.css';
import Lottries from './Lottries';

interface IShiftProps{
  date: dayjs.Dayjs | undefined,
  newShift?: boolean ,
  ondissmiss: (newSummary: IHistory | undefined) => any,
}

const Shift: React.FC<IShiftProps> = ({date, ondissmiss, newShift=false}) => {
  const [data, setData] = useState<ILottery[]>([])
  const [summaryData, setSummaryData] = useState<ISummary>({lotto: 0, online: 0, total: 0})
  const [notes, setNotes] = useState("")
  const [presentToast] = useIonToast()
  const [presentAlert] = useIonAlert()
  const [lotteryModalOpen, setLotteryModalOpen] = useState<boolean>(false)
  const [loadingScreen, setLoadingScreen] = useState(true)
  const [dirtyPage, setDirtyPage] = useState<Boolean>(false)
  const ionContentRef = useRef<HTMLIonContentElement>(null)

  function addORsub(index: number, addORsub: "add" | "sub"){
    const clonedLottery: ILottery = Object.assign({}, data[index])
    const clonedSummary: ISummary = Object.assign({}, summaryData)
    const cloneData:ILottery[] = [...data]
    clonedSummary.lotto -= (clonedLottery.cur - clonedLottery.prev) * clonedLottery.cost
    if (addORsub === "add")
      clonedLottery.cur += 1
    else
      clonedLottery.cur -= 1
    clonedLottery.sale = (clonedLottery.cur - clonedLottery.prev) * clonedLottery.cost
    clonedSummary.lotto += clonedLottery.sale
    clonedSummary.total = clonedSummary.lotto + clonedSummary.online
    cloneData[index] = clonedLottery
    setData(cloneData)
    setSummaryData(clonedSummary)
  }

  function onLotteryChange(e : any, index : number){
    let intValueChange: number = parseInt(e.target.value)
    if(!intValueChange){
      intValueChange = 0
    }
    const clonedLottery: ILottery = Object.assign({}, data[index])
    const clonedSummary: ISummary = Object.assign({}, summaryData)
    const cloneData:ILottery[] = [...data]
    clonedSummary.lotto -= (clonedLottery.cur - clonedLottery.prev) * clonedLottery.cost
    clonedLottery.cur = intValueChange
    clonedLottery.sale = (clonedLottery.cur - clonedLottery.prev) * clonedLottery.cost
    clonedSummary.lotto += clonedLottery.sale
    clonedSummary.total = clonedSummary.lotto + clonedSummary.online
    cloneData[index] = clonedLottery
    setData(cloneData)
    setSummaryData(clonedSummary)
  }

  function refreshSummary(e : any){
    const clonedSummary: ISummary = Object.assign({}, summaryData)
    let intValue: number = parseFloat(e.target.value.replace('$', ''))
    if(!intValue)
      intValue = 0.0
    clonedSummary.online = intValue
    clonedSummary.total = clonedSummary.lotto + intValue
    setSummaryData(clonedSummary)
  }

  function focusOnNextInput(index: number){
    const nextInput : HTMLIonInputElement | null = document.getElementById(index + "Focus") as HTMLIonInputElement
    nextInput.value = ''
    nextInput?.setFocus()
  }

  function lotteryModalDissmised(newLottery: ILottery | undefined){
    setLotteryModalOpen(false)
    if(newLottery){
      const clonedShift = [...data]
      clonedShift.push(newLottery)
      setData(clonedShift)
    }
  }

  function finish(){
    if(date){
      const result = setShiftByDate(date, {date: date, lottos: data, notes:notes, summaray: summaryData})
      if(result){
        presentToast({message: "Shift set.", icon: checkmarkSharp, duration: 3000})
        ondissmiss({...summaryData, date: date, notes: notes})
      }
    }
  }

  function scrollToBottom(){
    ionContentRef?.current?.scrollToBottom(2000);
  }

  useEffect(() => {
    if(!date){
      return
    }
    let shift:IShift | undefined = undefined
    if(newShift){
      shift = getPrevShiftByDate(date)
    }else{
      shift = getShiftByDate(date)
    }
    if(shift && shift.lottos){
      setData(shift.lottos)
      setSummaryData(shift.summaray)
      setNotes(shift.notes)
      setLoadingScreen(false)
      if(!newShift){
      setTimeout(() => {
        scrollToBottom()
        }, 500); }
    }else{
      presentAlert({header: "ERROR", subHeader: "No previous shift found.", message: "If this is your first time add the shift please ignore this message. If its not, it is not same to continue.", buttons:['Ok']})
    }
  },[])

  return (
    <>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton/>
            </IonButtons>
            <IonButton onClick={() => {ondissmiss(undefined)}} slot='end' size={'small'} color={'danger'} fill={'clear'}>Cancel</IonButton>
            <IonTitle>{newShift ? "New Shift " : "View Shift"} {date?.format("MM/DD/YY")}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent ref={ionContentRef} className="ion-padding">
            <IonLoading isOpen={loadingScreen}/>

            <IonListHeader><h1>{date?.format("MMM DD, YYYY")}</h1></IonListHeader>
            <IonReorderGroup disabled={false} onIonItemReorder={(event) => {setData(event.detail.complete(data))}}>
              {data.map((e,i) => <IonItem  shape='round' key={i}>
                    <IonGrid >

                      <IonRow >
                        <IonLabel><p>{i+1} {e.name} - ${e.cost}</p></IonLabel>
                      </IonRow>

                      <IonRow>

                        <IonCol sizeMd='5' sizeLg='5' sizeXs='3'>
                        <IonItem lines='none'>
                          <IonLabel><p>{e.prev}</p></IonLabel>
                          </IonItem>
                        </IonCol>

                        <IonCol sizeMd='3' sizeLg='3' sizeXs='9'>
                        <IonItem lines='none'>
                          <IonButton fill='clear' onClick={() => addORsub(i, "sub")} >-</IonButton>
                            <IonInput defaultValue={200} onIonChange={(e) => {onLotteryChange(e,i)}} placeholder={e.prev.toString()} clearOnEdit size={200} id={i + "Focus"} onKeyUp={(e) => {if(e.code === 'Enter') focusOnNextInput(i+1)}} class='current-lottery-label' value={e.cur}></IonInput>
                          <IonButton onClick={() => addORsub(i, "add")}>+</IonButton>
                        </IonItem>
                        </IonCol>

                        <IonCol  >
                          <IonItem lines='none'>
                          <IonLabel slot='end'>$ {e.sale}</IonLabel>
                          </IonItem>
                        </IonCol>

                      </IonRow>
                    </IonGrid>
                    <IonReorder />
              </ IonItem>)}
            </IonReorderGroup>
            
              <IonItem >
                <IonGrid>
                  <IonButton onClick={() => setLotteryModalOpen(true)} fill='clear' expand='block'><IonIcon slot='start' icon={addSharp}/>New Slot</IonButton>
                </IonGrid> 
              </IonItem>

            <IonList lines='full'>
              <IonListHeader>Summary</IonListHeader>

              <IonItem>
                <IonLabel position='stacked'>Lotto Sale</IonLabel>
                <IonInput disabled placeholder='$0' value={'$ ' + summaryData.lotto}></IonInput>
              </IonItem>

              <IonItem>
                <IonLabel position='stacked'>Online Sale</IonLabel>
                <IonInput debounce={500} onIonChange={refreshSummary} value={'$ ' + summaryData.online} placeholder='$0'></IonInput>
              </IonItem>

              <IonItem>
                <IonLabel position='stacked'>Total Sale</IonLabel>
                <IonInput disabled placeholder='$0' value={'$ ' + summaryData.total}></IonInput>
              </IonItem>
            </IonList>

            <IonItem>
              <IonLabel position='stacked'>Notes</IonLabel>
              <IonTextarea onIonChange={(e) => setNotes(e.target.value ? e.target.value : "")} rows={5} value={notes}></IonTextarea>
            </IonItem>
            
            <IonButton expand='full' fill='clear' onClick={finish}>Finish</IonButton>
            <IonModal onIonModalWillDismiss={() => lotteryModalDissmised(undefined)} isOpen={lotteryModalOpen}>
                <Lottries ondissmiss={lotteryModalDissmised}/>
            </IonModal>
        </IonContent>
    </>
  );
};

export default Shift;
