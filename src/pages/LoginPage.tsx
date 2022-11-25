import { IonButton, IonContent, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonPage, IonTitle, IonToolbar } from "@ionic/react"
import { lockClosedSharp } from "ionicons/icons"

const LoginPage:React.FC<{handler: () => void}> = ({handler}) => {
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Login</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent >
                <IonItem className="margin-top">
                    <IonLabel position="stacked">Username</IonLabel>
                    <IonInput></IonInput>
                </IonItem>
                <IonItem>
                    <IonLabel position="stacked">Password</IonLabel>
                    <IonInput></IonInput>
                </IonItem>
                <IonItem lines="none">
                    <IonGrid fixed>
                       <IonButton size="default" onClick={handler} expand="block">Login</IonButton>
                    </IonGrid>
                </IonItem>
            </IonContent>
        </IonPage>
    )
}
export default LoginPage