import { IonPage, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonButton, IonIcon, IonTitle, IonContent } from "@ionic/react"
import MyHeader from "../components/Header"

const LotterySetting:React.FC = () => {
    return(
        <IonPage id="main-content">
          <MyHeader title="Lottery Settings"/>
          <IonContent ></IonContent>
          </IonPage>
    )
}

export default LotterySetting