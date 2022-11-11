import { IonHeader, IonMenu, IonToolbar, IonTitle, IonContent, IonButtons, IonMenuButton, IonButton, IonPage, IonCard, IonCardHeader, IonCardContent, IonCardTitle, IonGrid, IonRow, IonCol, IonText, IonItem, IonLabel, IonItemDivider, IonIcon, IonInput, IonList, IonTextarea } from "@ionic/react"
import { calendar} from 'ionicons/icons'
import './Home.css'

const Home: React.FC = () => {
    return (
      <>
        <IonMenu contentId="main-content">
          <IonHeader>
            <IonToolbar>
              <IonTitle>Menu</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            This is the menu content.
          </IonContent>
        </IonMenu>
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
          <IonCard className="card-margin">
                <IonCardHeader>
                    <IonCardTitle>Today</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                    <IonButton size="large" fill="clear" expand="full">+</IonButton>
                </IonCardContent>
            </IonCard>

            
            <IonCard className="card-margin">
                <IonCardHeader>
                    <IonCardTitle>July 3, 2022</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                    <IonText>
                        Lotto: $000 | Online: $000 | 
                    </IonText>
                    <IonText color={'primary'}>
                         Total: $000
                    </IonText>
                    <br></br>
                    <br></br>
                    <IonText className="note-area">{`Cash: $425 \n G: $50 \n WIC: $250`}</IonText>
                </IonCardContent>
            </IonCard>


          </IonContent>
        </IonPage>
      </>
    );
}

export default Home;