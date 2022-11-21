import { IonContent, IonPage } from "@ionic/react"
import MyHeader from "../components/Header"
import Lottries from "./Lottries"


const LottriesPage: React.FC = () => {
    return(
        <IonPage>
            <MyHeader title="Lottries Page"/>     
            <IonContent>
                <Lottries ondissmiss={() => {}}/>
            </IonContent>   
        </IonPage>
    )
}

export default LottriesPage