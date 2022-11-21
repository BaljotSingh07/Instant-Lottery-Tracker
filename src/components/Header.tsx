import { IonHeader, IonToolbar, IonButtons, IonMenuButton, IonButton, IonTitle, IonContent } from "@ionic/react"

interface IHeader {
    title: string,

}

const MyHeader: React.FC<IHeader> = ({title}) => {
    return(
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
                
              </IonButton>
              <IonTitle>{title}</IonTitle>
            </IonToolbar>
          </IonHeader>
    )
}

export default MyHeader