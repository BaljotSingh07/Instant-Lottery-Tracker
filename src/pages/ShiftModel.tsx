import { IonContent, IonHeader, IonTitle, IonToolbar, IonReorder, IonReorderGroup, IonItem, IonLabel, IonGrid, IonRow, IonCol, IonButton, IonIcon, IonInput, IonList, IonListHeader, IonTextarea, useIonAlert, IonLoading, useIonToast, IonModal, useIonViewDidLeave, IonItemDivider } from '@ionic/react';
import React, { useEffect, useRef, useState } from 'react';
import { useIonViewWillLeave } from '@ionic/react';
import { checkmarkSharp, addSharp, removeSharp, removeCircleSharp } from 'ionicons/icons';
import {getShiftByDate, setShiftByDate ,ILottery, ISummary, IHistory, IShift, getPrevShiftByDate} from '../functions/functions';
import dayjs from 'dayjs';
import './Shift.css';
import Lottries from './Lottries';
import { useLocation, useHistory } from 'react-router';

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
  const [deleteMode, setDeleteMode] = useState(false)
  const ionContentRef = useRef<HTMLIonContentElement>(null)
  const nav = useHistory()
  const location = useLocation()

  function addORsub(index: number, addORsub: "add" | "sub"){
    const clonedLottery: ILottery = Object.assign({}, data[index])
    const clonedSummary: ISummary = Object.assign({}, summaryData)
    const cloneData = [...data]
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
    const cloneData = [...data]
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
    nav.replace("?modalOpened=true")
    if(newLottery){
      const clonedShift = [...data]
      clonedShift.push(newLottery)
      setData(clonedShift)
    }
  }

  function removeLotto(i: number){
    const cloneData = [...data]
    if(i === cloneData.length - 1){
      cloneData.pop()
      for(let i = cloneData.length-1; i >= 0; i--){
        console.log(cloneData[i])
        if(cloneData[i] === null){
          cloneData.pop()
        }else{
          break 
        }
      }
    }else{
      cloneData[i] = null
    }
    setData(cloneData)
    setDeleteMode(false)
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
    if(!location.search.includes('lottriesOpen=true')) {
      setLotteryModalOpen(false)
   }
  },[location])
  
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
    }else{
      presentAlert({header: "ERROR", subHeader: "No previous shift found.", message: "If this is your first time add the shift please ignore this message. If its not, it is not safe to continue.", buttons:['Ok']})
    }
  },[])

  return (
    <>
        <IonHeader>
          <IonToolbar>
            <IonButton onClick={() => {ondissmiss(undefined)}} slot='end' size={'small'} color={'danger'} fill={'clear'}>Cancel</IonButton>
            <IonTitle>{newShift ? "New Shift " : "View Shift"} {date?.format("MM/DD/YY")}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent ref={ionContentRef} className="ion-padding">
            <IonLoading isOpen={loadingScreen}/>
            {/* <IonFab slot='fixed' vertical='top' horizontal='end'>
              <IonFabButton color={'light'} size='small'>
                <IonIcon  icon={arrowDownSharp}/>
              </IonFabButton>
            </IonFab> */}
            <IonListHeader><h1>{date?.format("MMM DD, YYYY")}</h1></IonListHeader>
            <IonReorderGroup  disabled={false} onIonItemReorder={(event) => {setData(event.detail.complete(data))}}>
              {data.map((e,i) => <IonItem key={i}>
                    <IonGrid>
                    {
                    e ?
                    <>
                    <div hidden={!deleteMode} className='overlay'>
                          <IonButton onClick={() => {removeLotto(i)}} fill='clear'><IonIcon slot='icon-only' color='danger' size='large' icon={removeCircleSharp}/></IonButton> 
                      </div>
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
                      </>
                    :
                    <>
                      <IonRow >
                        <IonLabel><p>{i+1} EMPTY</p></IonLabel>
                      </IonRow>
                      <IonButton onClick={() => {nav.push("?modalOpened=true&lottriesOpen=true"); setLotteryModalOpen(true)}} className='full' expand='block' fill='clear'><IonIcon slot='start' icon={addSharp}/>Place Lottery</IonButton>
                    </>
                    }
                    </IonGrid>
                    <IonReorder />
              </ IonItem>)}
            </IonReorderGroup>
              <IonItem lines='none'>
                <IonGrid>
                  <IonButton onClick={() => {nav.push("?modalOpened=true&lottriesOpen=true"); setLotteryModalOpen(true)}} fill='clear' expand='block'><IonIcon slot='start' icon={addSharp}/>New Slot</IonButton>
                </IonGrid> 
              </IonItem>
              <IonItem >
                <IonGrid>
                  <IonButton onClick={() => {setDeleteMode(!deleteMode)}} color='danger' expand='block' fill={deleteMode ? 'solid': 'clear'}><IonIcon hidden={deleteMode} slot='start' icon={removeSharp} />{deleteMode? 'Cancel' : 'Remove Slot'}</IonButton>
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
