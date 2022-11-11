import { IonHeader, useIonAlert, IonToolbar, useIonToast ,IonTitle, IonContent, IonButtons, IonMenuButton, IonButton, IonPage, IonGrid, IonRow, IonCol, IonText, IonItem, IonLabel, IonIcon, IonList, IonBadge, IonNavLink, IonModal, useIonModal, RefresherEventDetail, IonRefresherContent, IonRefresher, IonProgressBar } from "@ionic/react"
import dayjs from "dayjs"
import { calendar, ticket, laptop, add, checkmarkSharp, alertSharp, newspaper} from 'ionicons/icons'
import { useEffect, useState } from "react"
import Menu from "../components/Menu"
import { IHistory, getHistory, updateOnlineByDate } from "../functions/functions"
import './Home.css'
import Shift from "./Shift"

const Home2: React.FC = () => {
  const [shifts, setShifts] = useState<Array<IHistory>>([])
  const [onlineAlert] = useIonAlert()
  const [presentToast] = useIonToast();
  const [loading, setLoading] = useState(true);
  const [shiftModal, setShiftModal] = useState<{date: dayjs.Dayjs, new: boolean}>()

  function updateOnlineLottery(date: dayjs.Dayjs, i : number){
    onlineAlert({
      header: "Online Sale",
      message: "This shift has an missing online. Enter it in the input below to add it.",
      inputs: [
        {
          name: "online",
          type: 'number',
          placeholder: '$ 0',
        }
      ],
      buttons : [{
        text: "Save",
        handler: (data) => {
          const floatData = parseFloat(data.online);
          let updateSucc = false;
          if(floatData){
            const updateOnlineResult = updateOnlineByDate(date, floatData)
            if(updateOnlineResult){
              const clonedShifts = [...shifts]
              clonedShifts[i] = updateOnlineResult
              setShifts(clonedShifts)
              updateSucc = true
            }
          }
        
          if(!updateSucc)
            presentToast({message: "Error setting online sale. Please try again.", duration: 3000, icon: alertSharp})
          else
            presentToast({message: "Online sale set.", duration: 3000, icon: checkmarkSharp})
        }
      },
      {
        text: "Cancel",
        role: "cancel",
      }
    ]
    })
  }

  function shiftModalDissmissed(newSummary: IHistory | undefined){
    setShiftModal(undefined)
    if(newSummary){
      const clonedShifts = [...shifts]
      if(newSummary.date.isSame(shifts[0].date.add(1,'day'),'day')){ //We are adding a new shift
        clonedShifts.unshift(newSummary)
        setShifts(clonedShifts)
        return
      }
      let shiftByDate = clonedShifts.find((e:IHistory) => e.date.isSame(newSummary.date, 'day'))
      if(shiftByDate){        
        shiftByDate.lotto = newSummary.lotto
        shiftByDate.online = newSummary.online
        shiftByDate.total = newSummary.total
        shiftByDate.notes = newSummary.notes
        setShifts(clonedShifts)  
      }else{
        console.log("No shift found by date")
      }
    }
  }

  function handleRefresh(event: CustomEvent<RefresherEventDetail>) {
    setTimeout(() => {
      setShifts(getHistory())
      event.detail.complete();
    }, 2000);
  }

  useEffect(() => {
    setShifts(getHistory())
    setLoading(false)
  },[])

    return (
        <>
        <Menu/>
        <IonPage id="main-content">
          <IonHeader>
            <IonToolbar>
              <IonButtons slot="start">
                <IonMenuButton></IonMenuButton>
              </IonButtons>
              <IonButton
                slot="end"
                color={'dark'}
                size={"small"}
                fill={"clear"}
            
              >
                <IonIcon icon={calendar}/>
              </IonButton>
              <IonTitle>Home</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
          <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
            {loading ? <IonProgressBar type="indeterminate"/> :
            <IonList >
                <>
                
                 <IonItem>
                    <IonLabel position="stacked"><h1>{shifts && shifts[0].date.subtract(1,'day').isSame(dayjs(),'day')? "Today": shifts[0].date.add(1,'day').format("MMM DD, YYYY")}</h1></IonLabel>
                    
                    <IonGrid>
                      <IonRow>
                        <IonCol></IonCol>
                        <IonCol><IonButton onClick={() => {setShiftModal({date: shifts[0].date.add(1,'day'), new: true})}} routerDirection="forward" fill="clear" expand="block" size="large" strong>+</IonButton></IonCol>
                        <IonCol></IonCol>
                      </IonRow>
                      
                    </IonGrid>

                    <IonText color={'medium'}  className="note-area">
                        Missing shift click + to add
                    </IonText>
                  </IonItem>
            
                    {shifts.map((e,i) => 
                      <div key={i}>
                      
                      <IonItem lines="none">
                      {e.online === 0 ? <IonBadge onClick={() => {updateOnlineLottery(e.date, i)}} slot='end' color={'warning'}><IonIcon icon={add}/>Missing Online!</IonBadge>
                      :<></>}
                      </IonItem>
                      <IonItem onClick={() => {setShiftModal({date: e.date, new: false})}} detail={false} >

                        <IonLabel position="stacked"><h1>{e.date.format("MMM DD YYYY")}</h1></IonLabel>

                        
                        <div className="sale-display">
                            <div >
                                <IonIcon color="medium" icon={ticket}/><IonText color={'medium'}>$ {e.lotto}</IonText>
                            </div>
                            <div>
                                <IonIcon color="medium" icon={laptop}/><IonText color={'medium'}>$ {e.online}</IonText>
                            </div>
                            <div>
                                <IonText color={'primary'}>Σ</IonText><IonText color={'primary'}>$ {e.total}</IonText>
                            </div>
                        </div>

                        <IonText color={'medium'} placeholder="Notes" className="note-area">
                            {e.notes}
                        </IonText>

                      </IonItem>
                      </div>
                    )}
                </>
            </IonList>}
            <IonModal className="fullscreen" isOpen={shiftModal != undefined}>
                <Shift ondissmiss={shiftModalDissmissed} date={shiftModal?.date} newShift={shiftModal?.new}/>
            </IonModal>
          </IonContent>
        </IonPage>
      </>
    )   
}

export default Home2;