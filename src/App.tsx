import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact, IonTabs, IonTabBar, IonTabButton, IonLabel, IonIcon} from '@ionic/react';
import { IonReactHashRouter, IonReactRouter } from '@ionic/react-router';
import { homeSharp, settingsSharp, ticketSharp, logOutSharp } from 'ionicons/icons';
import Home from './pages/Home';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import LotterySetting from './pages/LotterySetting';
import LottriesPage from './pages/LottriesPage';
import LoginPage from './pages/LoginPage';
import { useState } from 'react';

setupIonicReact();

const App: React.FC = () => {
  const [user, setUser] = useState(true)

  if(!user){
    return <LoginPage handler={() => {setUser(true)}}/>
  }

  return <>
  <IonApp>
  <IonReactHashRouter>
    <IonTabs>
    <IonRouterOutlet>
   
      <Route exact path="/home">
        <Home />
      </Route>
      <Route exact path="/">
        <Redirect to="/home" />
      </Route>

      <Route exact path="/lottries">
        <LottriesPage />
      </Route>

      <Route exact path="/lottery-setting">
        <LotterySetting />
      </Route>

      <Route exact path="/logout">
        <></>
      </Route>

    </IonRouterOutlet>

      <IonTabBar slot="bottom">
        <IonTabButton href='/home' tab='home'>
          <IonLabel>Home</IonLabel>
          <IonIcon icon={homeSharp}/>
        </IonTabButton>

        <IonTabButton href='/lottries' tab='lottries'>
          <IonLabel>Lottries</IonLabel>
          <IonIcon icon={ticketSharp}/>
        </IonTabButton>

        <IonTabButton href='/lottery-setting' tab='Settings'>
          <IonLabel>Lottery Settings</IonLabel>
          <IonIcon icon={settingsSharp}/>
        </IonTabButton>

        <IonTabButton onClick={() => {setUser(false)}} href='/home' tab='logout'>
          <IonLabel>Log Out</IonLabel>
          <IonIcon color='danger' icon={logOutSharp}/>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
    </IonReactHashRouter>
  </IonApp>
  </>
}

export default App;
