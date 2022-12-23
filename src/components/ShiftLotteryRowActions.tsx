import { IonList, IonItem, IonIcon } from "@ionic/react";
import { addSharp, refreshSharp, trashSharp } from "ionicons/icons";


interface IShiftLotteryRowActions{
    onNewRowClick: () => void;
    onReplaceClick: () => void;
    onDeleteClick: () => void;
}

const ShiftLotteryRowActions: React.FC<IShiftLotteryRowActions> = ({onDeleteClick, onNewRowClick, onReplaceClick }) => (
  <IonList>
    <IonItem onClick={onNewRowClick} detail={false} button><IonIcon size='medium' slot="start" color="success" icon={addSharp}/>Row Below</IonItem>
    <IonItem onClick={onReplaceClick} detail={false}  button><IonIcon size='medium' slot="start" color="warning" icon={refreshSharp}/> Replace</IonItem>
    <IonItem onClick={onDeleteClick} detail={false}  button><IonIcon size='medium' slot="start" color="danger" icon={trashSharp}/> Delete</IonItem>
  </IonList>
);

export default ShiftLotteryRowActions 