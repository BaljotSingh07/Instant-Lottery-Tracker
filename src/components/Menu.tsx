import { IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonIcon } from "@ionic/react"
import { homeSharp, settingsSharp } from "ionicons/icons"
const Menu: React.FC = () => {
    return (
        <IonMenu contentId="main-content">
          <IonHeader>
            <IonToolbar>
              <IonTitle>Menu</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <IonList lines="none">
              <IonItem routerLink="/home" detail={false} button>
                <IonIcon slot="start" icon={homeSharp}></IonIcon>
                <IonLabel>Home</IonLabel>
              </IonItem>
              <IonItem detail={false} button>
                <IonIcon slot="start" icon={settingsSharp}></IonIcon>
                <IonLabel>Lottery Setting</IonLabel>
              </IonItem>
            </IonList>
          </IonContent>
        </IonMenu>
    )
}

export default Menu