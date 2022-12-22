import { useIonAlert, useIonToast, IonContent, IonButton, IonPage, IonGrid, IonRow, IonCol, IonText, IonItem, IonLabel, IonIcon, IonList, IonBadge, IonModal, RefresherEventDetail, IonRefresherContent, IonRefresher, IonProgressBar, IonSplitPane } from "@ionic/react";
import dayjs, { Dayjs } from "dayjs";
import { ticket, laptop, add, checkmarkSharp, alertSharp } from "ionicons/icons";
import { useEffect, useState } from "react";
import { IHistory, getHistory, updateOnlineByDate } from "../functions/functions";
import "./Home.css";
import Shift from "./ShiftModel";
import { useLocation, useHistory } from "react-router";
import MyHeader from "../components/Header";

const Home: React.FC = () => {
  const [shifts, setShifts] = useState<Array<IHistory>>([]);
  const [onlineAlert] = useIonAlert();
  const [presentToast] = useIonToast();
  const [loading, setLoading] = useState(true);
  const [splitPaneIsVisible, setSplitPaneIsVisible] = useState(false)
  const [shiftModal, setShiftModal] = useState<{
    date: dayjs.Dayjs;
    new: boolean;
  }>();
  const nav = useHistory();
  const location = useLocation();

  function updateOnlineLottery(date: dayjs.Dayjs, i: number) {
    onlineAlert({
      header: "Online Sale",
      message: "This shift has an missing online. Enter it in the input below to add it.",
      inputs: [
        {
          name: "online",
          type: "number",
          placeholder: "$ 0",
        },
      ],
      buttons: [
        {
          text: "Save",
          handler: async (data) => {
            const onlineSale = parseFloat(data.online);
            let updateSucc = false;
            if (onlineSale) {
              const updateOnlineResult = await updateOnlineByDate(date, onlineSale, onlineSale + shifts[i].lotto);
              if (updateOnlineResult) {
                const clonedShifts = [...shifts];
                clonedShifts[i].online= onlineSale;
                clonedShifts[i].total= onlineSale + clonedShifts[i].lotto;
                setShifts(clonedShifts);
                updateSucc = true;
              }
            }

            if (!updateSucc)
              presentToast({
                message: "Error setting online sale. Please try again.",
                duration: 3000,
                icon: alertSharp,
              });
            else
              presentToast({
                message: "Online sale set.",
                duration: 3000,
                icon: checkmarkSharp,
              });
          },
        },
        {
          text: "Cancel",
          role: "cancel",
        },
      ],
    });
  }

  function shiftModalDissmissed(newSummary: IHistory | undefined) {
    setShiftModal(undefined);
    nav.goBack(); //go back to the home page
    if (newSummary) {
      const clonedShifts = [...shifts];
      if (newSummary.date.isSame(shifts[0].date.add(1, "day"), "day")) {
        //We are adding a new shift
        clonedShifts.unshift(newSummary);
        setShifts(clonedShifts);
        return;
      }
      let shiftByDate = clonedShifts.find((e: IHistory) => e.date.isSame(newSummary.date, "day"));
      if (shiftByDate) {
        shiftByDate.lotto = newSummary.lotto;
        shiftByDate.online = newSummary.online;
        shiftByDate.total = newSummary.total;
        shiftByDate.notes = newSummary.notes;
        setShifts(clonedShifts);
      } else {
        console.log("No shift found by date");
      }
    }
  }

  function openShiftModel(isNew: boolean, date?: dayjs.Dayjs) {
    if (isNew) setShiftModal({ date: shifts[0].date.add(1, "day"), new: true });
    if (date) setShiftModal({ date: date, new: false });
    nav.push(nav.location.pathname + "?modalOpened=true");
  }

  function handleRefresh(event: CustomEvent<RefresherEventDetail>) {
    setTimeout(() => {
      //setShifts(getHistory());
      event.detail.complete();
    }, 2000);
  }

  useEffect(() => {
    if (!location.search.includes("modalOpened=true")) {
      setShiftModal(undefined);
    }
  }, [location]);

  useEffect(() => {
    getHistory()
    .then(e => {setShifts(e)})
    setLoading(false);
  }, []);

  function re(){
    return <div >
    <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
      <IonRefresherContent></IonRefresherContent>
    </IonRefresher>
    {loading ? (
      <IonProgressBar type="indeterminate" />
    ) : (
      <IonList id="list-of-shifts">
        <>
          <IonItem>
            <IonLabel position="stacked">
              {shifts[0] ? 
              <h1>{shifts[0].date.subtract(1, "day").isSame(dayjs(), "day") ? "Today" : shifts[0].date.add(1, "day").format("MMM DD, YYYY")}</h1>
              :
              <></>  
            }
            </IonLabel>

            <IonGrid>
              <IonRow>
                <IonCol></IonCol>
                <IonCol>
                  <IonButton
                    onClick={() => {
                      openShiftModel(true);
                    }}
                    routerDirection="forward"
                    fill="clear"
                    expand="block"
                    size="large"
                    strong>
                    +
                  </IonButton>
                </IonCol>
                <IonCol></IonCol>
              </IonRow>
            </IonGrid>

            <IonText color={"medium"} className="note-area">
              Missing shift click + to add
            </IonText>
          </IonItem>

          {shifts.map((e, i) => (
            <div key={i}>
              <IonItem lines="none">
                {e.online === 0 ? (
                  <IonBadge
                    onClick={() => {
                      updateOnlineLottery(e.date, i);
                    }}
                    slot="end"
                    color={"warning"}>
                    <IonIcon icon={add} />
                    Missing Online!
                  </IonBadge>
                ) : (
                  <></>
                )}
              </IonItem>
              <IonItem
                onClick={() => {
                  openShiftModel(false, e.date);
                }}
                detail={false}>
                <IonLabel position="stacked">
                  <h1>{e.date.format("MMM DD YYYY")}</h1>
                </IonLabel>

                <div className="sale-display">
                  <div>
                    <IonIcon color="medium" icon={ticket} />
                    <IonText color={"medium"}>$ {e.lotto}</IonText>
                  </div>
                  <div>
                    <IonIcon color="medium" icon={laptop} />
                    <IonText color={"medium"}>$ {e.online}</IonText>
                  </div>
                  <div>
                    <IonText color={"primary"}>Σ</IonText>
                    <IonText color={"primary"}>$ {e.total}</IonText>
                  </div>
                </div>

                <IonText color={"medium"} placeholder="Notes" className="note-area">
                  {e.notes}
                </IonText>
              </IonItem>
            </div>
          ))}
        </>
      </IonList>
    )}
    {/* <IonModal className="fullscreen" isOpen={shiftModal != undefined}>
      <Shift ondissmiss={shiftModalDissmissed} date={shiftModal?.date} creatingANewShift={shiftModal?.new} />
    </IonModal> */}
    </div>
  }

  return (
    <IonPage id="main-content">
      <MyHeader title="Home" />
      <IonContent>
        <IonSplitPane onIonSplitPaneVisible={({detail}) => {if(splitPaneIsVisible !== detail.visible)setSplitPaneIsVisible(detail.visible)}} contentId="main" when="lg">
        {re()}    

        <div hidden={!splitPaneIsVisible} id="main">
          {shiftModal?
          <IonPage>
            <Shift ondissmiss={shiftModalDissmissed} date={shiftModal?.date} creatingANewShift={shiftModal?.new} />
          </IonPage>
          :
          <></>
          }
        </div>
      </IonSplitPane>
      <div hidden={splitPaneIsVisible}>
        {re()} 
        <IonModal hidden={splitPaneIsVisible} className="fullscreen" isOpen={shiftModal != undefined}>
          <Shift ondissmiss={shiftModalDissmissed} date={shiftModal?.date} creatingANewShift={shiftModal?.new} />
        </IonModal> 
      </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
