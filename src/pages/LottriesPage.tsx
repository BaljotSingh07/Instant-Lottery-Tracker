import { IonContent, IonPage } from "@ionic/react"
import MyHeader from "../components/Header"
import Lottries from "./Lottries"


const LottriesPage: React.FC = () => {
    return(
        <IonPage>
            <Lottries /> 
        </IonPage>
    )
}

export default LottriesPage