import { IonContent, IonHeader, IonTitle, IonToolbar, IonReorder, IonReorderGroup, IonItem, IonLabel, IonGrid, IonButton, IonInput, IonList, IonListHeader, IonTextarea, useIonToast, IonModal, IonProgressBar, IonPopover, IonSegment, IonSegmentButton } from "@ionic/react";
import React, { MouseEvent, useEffect, useRef, useState } from "react";
import { checkmarkSharp } from "ionicons/icons";
import { getShiftByDate, setShiftByDate, ILotteryPack, ISummary, IHistory, IShift, getPrevShiftByDate } from "../functions/functions";
import dayjs from "dayjs";
import "./Shift.css";
import Lottries from "./Lottries";
import { useLocation, useHistory } from "react-router";
import ShiftLotteryRow from "../components/ShiftLotteryRow";
import ShiftLotteryRowActions from "../components/ShiftLotteryRowActions";

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
  const [lotteryModalState, setLotteryModalState] = useState<{ open: boolean; putAtIndex?: number }>({ open: false });
  const [loadingScreen, setLoadingScreen] = useState(true);
  const [reorderMode, setReorderMode] = useState(false);
  const [lotteryActionPopover, setLotteryActionPopover] = useState<{ open: boolean; event?: MouseEvent; index?: number }>({ open: false });
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
    setLotteryModalState({ open: false });
    nav.replace("?modalOpened=true");
    if (newLottery) {
      const clonedShift = [...lotteries];
      if (lotteryModalState.putAtIndex) {
        if(clonedShift[lotteryModalState.putAtIndex])
          clonedShift.splice(lotteryModalState.putAtIndex, 0, newLottery)
        else
          clonedShift[lotteryModalState.putAtIndex] = newLottery;
      } else {
        clonedShift.push(newLottery);
      }
      setLotteries(clonedShift);
    }
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
      setLotteryModalState({ open: false });
    }
  }, [location]);

  async function getShiftData() {
    if (date) {
      setLoadingScreen(true);

      let shiftData: IShift | undefined;
      if (creatingANewShift) shiftData = await getPrevShiftByDate(date);
      else shiftData = await getShiftByDate(date);

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
    getShiftData();
  }, [date]);

  function openLotteryPopover(index: number, event: MouseEvent) {
    setLotteryActionPopover({ open: true, index: index, event: event });
  }

  function deleteLottery() {
    const cloneData = [...lotteries];
    if (lotteryActionPopover.index === cloneData.length - 1) {
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
      if (lotteryActionPopover.index !== undefined) cloneData[lotteryActionPopover.index] = null;
    }
    setLotteries(cloneData);
    setLotteryActionPopover({ open: false });
  }

  function newRow() {
    if (lotteryActionPopover.index === undefined) return;

    nav.push("?modalOpened=true&lottriesOpen=true");
    setLotteryModalState({ open: true, putAtIndex: lotteryActionPopover.index + 1 });
    setLotteryActionPopover({ open: false });
  }

  function replaceLottery() {
    setLotteryActionPopover({ open: false });
  }

  return (
    <>
      <IonPopover
        isOpen={lotteryActionPopover.open}
        event={lotteryActionPopover.event}
        onDidDismiss={() => {
          setLotteryActionPopover({ open: false });
        }}>
        <ShiftLotteryRowActions onDeleteClick={deleteLottery} onNewRowClick={newRow} onReplaceClick={replaceLottery} />
      </IonPopover>
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
                    setLotteryModalState({ open: true, putAtIndex: i });
                  }}
                  onCurrentLotteryNumberChange={onCurrentLotteryNumberChange}
                  addOrSubCurrentLotteryNumber={addORsub}
                  isEmpty={true}
                  onLotteryActionClick={openLotteryPopover}
                />
              </IonGrid>
              <IonReorder slot="end" />
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
        <IonHeader>Reorder</IonHeader>
        <IonSegment onIonChange={(e) => {if(e.detail.value === 'off') setReorderMode(false); else setReorderMode(true)}}>
          <IonSegmentButton value="off">Off</IonSegmentButton>
          <IonSegmentButton value="on">On</IonSegmentButton>
        </IonSegment>
      </IonContent>
    </>
  );
};

export default Shift;
