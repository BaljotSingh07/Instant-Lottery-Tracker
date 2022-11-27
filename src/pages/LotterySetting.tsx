import { IonPage, IonContent, IonList, IonListHeader, IonItem, IonNote, IonLabel, IonTitle, IonGrid, IonRow, IonCol, IonInput, IonButton, IonItemDivider, IonIcon } from "@ionic/react"
import { addSharp } from "ionicons/icons"
import { useState } from "react"
import MyHeader from "../components/Header"

const LotterySetting:React.FC = () => {
    const [data, setData] = useState([{cost: 1, endingnumber: 399},{cost: 2, endingnumber: 299},{cost: 3, endingnumber: 99}, ])

    function addNewSetting(){
        setData([...data, {cost: 0, endingnumber: 0}])
    }

    return(
        <IonPage id="main-content">
          <MyHeader title="Lottery Settings"/>
          <IonContent>
            <IonList>
                <IonListHeader>
                    <IonLabel>End Numbers</IonLabel>
                </IonListHeader>
                <IonItem lines="none">
                    <IonLabel><p>Set the ending number of lotteries according to price.</p></IonLabel>
                </IonItem>
                {data.map((e,i) =>
                <IonItem key={i}>
                    <IonGrid fixed>
                        <IonRow>
                            <IonCol>
                                <IonLabel position="stacked">Cost</IonLabel>
                                <IonInput type="number" value={e.cost}></IonInput>
                            </IonCol>
                            <IonCol>
                                <IonLabel position="stacked">Ending Number</IonLabel>
                                <IonInput type="number" value={e.endingnumber}></IonInput>
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
                        <IonButton size="default" expand="block">SAVE</IonButton>
                    </IonGrid>
                </IonItem>
            </IonList>
          </IonContent>
          </IonPage>
    )
}

export default LotterySetting