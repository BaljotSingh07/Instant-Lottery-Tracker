import { IonContent, IonHeader, IonTitle, IonToolbar, IonReorder, IonReorderGroup, IonItem, IonLabel, IonGrid, IonButton, IonIcon, IonInput, IonList, IonListHeader, IonTextarea, IonLoading, useIonToast, IonModal, useIonActionSheet, IonProgressBar } from "@ionic/react";
import React, { useEffect, useRef, useState } from "react";
import { checkmarkSharp, addSharp, trashBinOutline, ellipsisVerticalSharp, reorderThreeOutline } from "ionicons/icons";
import { getShiftByDate, setShiftByDate, ILotteryPack, ISummary, IHistory, IShift, getPrevShiftByDate } from "../functions/functions";
import dayjs from "dayjs";
import "./Shift.css";
import Lottries from "./Lottries";
import { useLocation, useHistory } from "react-router";
import ShiftLotteryRow from "../components/ShiftLotteryRow";
import { OverlayEventDetail } from "@ionic/core";

interface IShiftProps {
  date: dayjs.Dayjs | undefined;
  creatingANewShift?: boolean;
  ondissmiss: (newSummary: IHistory | undefined) => any;
}

const Shift: React.FC<IShiftProps> = ({ date, ondissmiss, creatingANewShift = false }) => {
  const [lotteries, setLotteries] = useState<ILotteryPack[]>([]);
  const [summaryData, setSummaryData] = useState<ISummary>({
    lotto: 0,
    online: 0,
    total: 0,
  });
  const [notes, setNotes] = useState("");
  const [presentToast] = useIonToast();
  const [shiftActionSheet] = useIonActionSheet()
  const [lotteryModalState, setLotteryModalState] = useState<{open: boolean, putAtIndex?: number}>({open: false});
  const [loadingScreen, setLoadingScreen] = useState(true);
  const [deleteMode, setDeleteMode] = useState(false);
  const [reorderMode, setReorderMode] = useState(false);
  const ionContentRef = useRef<HTMLIonContentElement>(null);
  const nav = useHistory();
  const location = useLocation();

  function addORsub(index: number, addORsub: "add" | "sub") {
    let currentlotteryNumber = lotteries[index]?.cur;
    if (currentlotteryNumber === undefined) return; // avoid add or removing with a row is null
    if (addORsub === "add") currentlotteryNumber += 1;
    else currentlotteryNumber -= 1;
    changeCurrentLotteryNumber(index, currentlotteryNumber);
  }

  function onCurrentLotteryNumberChange(e: any, index: number) {
    let intValueChange: number = parseInt(e.target.value);
    if (!intValueChange) {
      intValueChange = 0;
    }
    changeCurrentLotteryNumber(index, intValueChange);
  }

  function changeCurrentLotteryNumber(index: number, currentLotteryNumber: number) {
    const clonedLottery: ILotteryPack = Object.assign({}, lotteries[index]);
    const clonedSummary: ISummary = Object.assign({}, summaryData);
    const cloneData = [...lotteries];
    clonedSummary.lotto -= (clonedLottery.cur - clonedLottery.prev) * clonedLottery.cost;
    clonedLottery.cur = currentLotteryNumber;
    clonedLottery.sale = (clonedLottery.cur - clonedLottery.prev) * clonedLottery.cost;
    clonedSummary.lotto += clonedLottery.sale;
    clonedSummary.total = clonedSummary.lotto + clonedSummary.online;
    cloneData[index] = clonedLottery;
    setLotteries(cloneData);
    setSummaryData(clonedSummary);
  }

  function onOnlineLotteryChange(e: any) {
    const clonedSummary: ISummary = Object.assign({}, summaryData);
    let intValue: number = parseFloat(e.target.value.replace("$", ""));
    if (!intValue) intValue = 0.0;
    clonedSummary.online = intValue;
    clonedSummary.total = clonedSummary.lotto + intValue;
    setSummaryData(clonedSummary);
  }

  function lotteryModalDissmised(newLottery: ILotteryPack | undefined) {
    setLotteryModalState({open: false});
    nav.replace("?modalOpened=true");
    if (newLottery) {
      const clonedShift = [...lotteries];
      if(lotteryModalState.putAtIndex){
        clonedShift[lotteryModalState.putAtIndex] = newLottery
      }else{
        clonedShift.push(newLottery);
      }
      setLotteries(clonedShift);
    }
  }

  function removeLotteryRow(i: number) {
    const cloneData = [...lotteries];
    if (i === cloneData.length - 1) {
      cloneData.pop();
      for (let i = cloneData.length - 1; i >= 0; i--) {
        console.log(cloneData[i]);
        if (cloneData[i] === null) {
          cloneData.pop();
        } else {
          break;
        }
      }
    } else {
      cloneData[i] = null;
    }
    setLotteries(cloneData);
    setDeleteMode(false);
  }

  async function finish() {
    if (date) {
      const result = await setShiftByDate(date, {
        date: date,
        lottos: lotteries,
        notes: notes,
        summaray: summaryData,
      });
      if (result) {
        presentToast({
          message: "Shift set.",
          icon: checkmarkSharp,
          duration: 3000,
          color: "success",
        });
        ondissmiss({ ...summaryData, date: date, notes: notes });
      }
    }
  }

  useEffect(() => {
    if (!location.search.includes("lottriesOpen=true")) {
      setLotteryModalState({open: false});
    }
  }, [location]);

  async function getShiftData(){
    if(date){
      setLoadingScreen(true);
      
      let shiftData: IShift | undefined;
      if(creatingANewShift)
        shiftData = await getPrevShiftByDate(date)
      else
        shiftData = await getShiftByDate(date)

      if (shiftData && shiftData.lottos) {
        setLotteries(shiftData.lottos);
        setSummaryData(shiftData.summaray);
        setNotes(shiftData.notes);
        setLoadingScreen(false);
      }

    }
  }

  useEffect(() => {
    if (!date) return;
    getShiftData()
  }, [date]);

  function onShiftActionSheetDissmiss(detail: OverlayEventDetail<any>){
    if(!detail.data) return // the actions sheet was exited by backdrop

    const buttonActions = detail.data.action
    if(buttonActions === "reorder"){
      setReorderMode(!reorderMode)
    }else if(buttonActions === "new"){
      nav.push("?modalOpened=true&lottriesOpen=true");
      setLotteryModalState({open: true});
    }else if(buttonActions === "delete"){
      setDeleteMode(!deleteMode)
    }
  }
  function presentShiftActionSheet(){
    shiftActionSheet({
      header: 'Shift Options',
      buttons: [{
        text: "Toggle Reorder",
        icon: reorderThreeOutline,
        data: {action: 'reorder'}
      },{
        text: "New Row",
        icon: addSharp,
        data: {action: 'new'}
      },{
        text: "Remove Row",
        icon: trashBinOutline,
        role: "destructive",
        data: {action: 'delete'}
      },
      {
        text: "Cancel",
        role: "cancel",
        data: {action: 'cancel'}
      }],
      onDidDismiss({detail}) {
          onShiftActionSheetDissmiss(detail)
      },
    })
  }

  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonButton
            onClick={() => {
              ondissmiss(undefined);
            }}
            slot="end"
            size={"small"}
            color={"danger"}
            fill={"clear"}>
            Cancel
          </IonButton>
          <IonTitle>
            {creatingANewShift ? "New Shift " : "View Shift"} {date?.format("MM/DD/YY")}
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent ref={ionContentRef} className="ion-padding">
      <IonProgressBar hidden={!loadingScreen} type="indeterminate" />
        <IonListHeader>
          <h1>{date?.format("MMM DD, YYYY")}</h1>
          <IonButton onClick={presentShiftActionSheet} className="header-with-icon"><IonIcon size="small" slot="icon-only" icon={ellipsisVerticalSharp}/></IonButton>
        </IonListHeader>
        <IonReorderGroup
          disabled={!reorderMode}
          onIonItemReorder={(event) => {
            setLotteries(event.detail.complete(lotteries));
          }}>
          {lotteries.map((e, i) => (
            <IonItem key={i}>
              <IonGrid>
                <ShiftLotteryRow
                  LotteryPack={e}
                  index={i}
                  addNewLotteryPack={() => {
                    nav.push("?modalOpened=true&lottriesOpen=true");
                    setLotteryModalState({open: true, putAtIndex: i});
                  }}
                  onCurrentLotteryNumberChange={onCurrentLotteryNumberChange}
                  addOrSubCurrentLotteryNumber={addORsub}
                  deleteMode={deleteMode}
                  removeLotteryRow={removeLotteryRow}
                  isEmpty={true}
                />
              </IonGrid>
              <IonReorder slot="end"/>
            </IonItem>
          ))}
        </IonReorderGroup>
        <IonList lines="full">
          <IonListHeader>Summary</IonListHeader>

          <IonItem>
            <IonLabel position="stacked">Lotto Sale</IonLabel>
            <IonInput disabled placeholder="$0" value={"$ " + summaryData.lotto}></IonInput>
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Online Sale</IonLabel>
            <IonInput debounce={500} onIonChange={onOnlineLotteryChange} value={"$ " + summaryData.online} placeholder="$0"></IonInput>
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Total Sale</IonLabel>
            <IonInput disabled placeholder="$0" value={"$ " + summaryData.total}></IonInput>
          </IonItem>
        </IonList>

        <IonItem>
          <IonLabel position="stacked">Notes</IonLabel>
          <IonTextarea onIonChange={(e) => setNotes(e.target.value ? e.target.value : "")} rows={5} value={notes}></IonTextarea>
        </IonItem>

        <IonButton expand="full" fill="clear" onClick={finish}>
          Finish
        </IonButton>
        <IonModal onIonModalWillDismiss={() => lotteryModalDissmised(undefined)} isOpen={lotteryModalState.open}>
          <Lottries ondissmiss={lotteryModalDissmised} />
        </IonModal>
      </IonContent>
    </>
  );
};

export default Shift;
