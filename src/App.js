import React, {Component} from 'react';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import {HashRouter, Route, withRouter} from "react-router-dom";
import {Redirect} from "react-router-dom";
import UsersContainer from "./components/Users/UsersContainer";
import HeaderContainer from "./components/Header/HeaderContainer";
import LoginPage from "./components/Login/Login";
import {connect, Provider} from "react-redux";
import {compose} from "redux";
import {initializeApp} from "./redux/app-reducer";
import Preloader from "./components/common/Preloader/Preloader";
import store from "./redux/redux-store";
import {withSuspense} from "./hoc/withSuspense";

const DialogsContainer = React.lazy(() => import('./components/Dialogs/DialogsContainer'));
const ProfileContainer = React.lazy(() => import('./components/Profile/ProfileContainer'));
// Компоненты не загружаются сразу в bundle.js


class App extends Component {
    componentDidMount() {
        this.props.initializeApp();
        
    }
    // Вызываем функцию инициализации приложения(из props)

    render() {
        if (!this.props.initialized) {
            return <Preloader />
        }
        // Если не инициализировалось приложение, то возвращаем Preloader

        return (
                    <div className='app-wrapper'>
                        <HeaderContainer/>
                        <Navbar/>
                        <div className='app-wrapper-content'>
                            <Route exact path='/'
                                  render={() => <Redirect to={"/profile"} />}/>
                            <Route path='/dialogs'
                                   render={withSuspense(DialogsContainer)}/>

                            <Route path='/profile/:userId?'
                                   render={withSuspense(ProfileContainer)} />

                            <Route path='/users'
                                   render={() => <UsersContainer/>}/>

                            <Route path='/login'
                                   render={() => <LoginPage/>}/>

                            <Route path='/*'
                                   render={() => <div>404 NOT FOUND</div>}/>
                        </div>
                    </div>
        )
    }
}

const mapStateToProps = (state) => ({
    initialized: state.app.initialized
})


let AppContainer = compose(
    withRouter,
    connect(mapStateToProps, {initializeApp}))(App);
    // HOC connect и (WithRouter) для передачи данных из url
    // connect прокидывает пропсы из state и возвращает callback(initializeApp)

const SamuraiJSApp = (props) => {
   return <HashRouter >
        <Provider store={store}>
            <AppContainer />
        </Provider>
    </HashRouter>
}
// Обернули HashRouter для исправления URL на Github Pages

export default SamuraiJSApp;
