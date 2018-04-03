import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';
import { FIREBASE_CREDENTIALS } from '../../firebase.credentials';
import { AngularFireAuth } from 'angularfire2/auth';
import { GooglePlus } from '@ionic-native/google-plus';
import { Events } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

/*
Generated class for the LoggerProvider provider.

See https://angular.io/guide/dependency-injection for more info on providers
and Angular DI.
*/
@Injectable()
export class LoggerProvider {

    private langs: any = [
        'fr',
        'gb'
    ];

    private userProfile: firebase.User;
    public displayName: string;
    public email: string;
    
    constructor(private fireauth: AngularFireAuth,
        private googlePlus: GooglePlus,
        public events: Events,
        private translate: TranslateService) {
        this.fireauth.authState.subscribe(res => {
            if (res && res.uid) {
                this.userProfile = res;
                this.displayName = res.displayName ? res.displayName : res.email;
                this.email = res.email;
                this.events.publish('user:connected', this.userProfile);
            } else {
                this.userProfile = null;
                this.displayName = null;
                this.email = null;
                this.events.publish('user:disconnected');
            }
        });
    }

    /**
     * Obtient l'état de la connexion au service firebase / googleplus
     */
    public isLogged(): boolean {
        return this.userProfile !== null;
    }

    /**
     * Obtient l'identifiant de l'utilisateur courant. Null dans la cas ou la connexion n'est pas établie.
     */
    public getUserId() {
        if(this.isLogged())
            return this.userProfile.uid;
        return null;
    }

    /**
     * Réalise une tentative de connexion auprès du service Firebase
     * @param email L'email identifiant le compte utilisateur
     * @param password Le mot de passe du compte utilisateur
     */
    public sampleLogIn(email: string, password: string) {
        return new Promise((resolve, reject) => {
            this.fireauth.auth.signInWithEmailAndPassword(email, password).then((result) => {
                // si connection réalisée avec succés
                if (result) {
                    resolve(result);
                }
            }).catch((error) => {
                reject(error);
            });
        });
    }

    /**
     * Réalise un appel du plugin cordova natif GooglePlus, afin de s'authentifier avec un compte Google.
     */
    public googleLogIn() {
        return new Promise((resolve, reject) => {
            this.googlePlus.login({
                webClientId: FIREBASE_CREDENTIALS.webClientId,
                offline: true
            }).then(res => {
                const firecreds = firebase.auth.GoogleAuthProvider.credential(res.idToken);
                firebase.auth().signInWithCredential(firecreds).then((result) => {
                    resolve(result);
                }).catch((err) => {
                    reject(err);
                });
            }).catch(err => {
                reject(err);
            });
        });
    }

    public logOut() {
        this.fireauth.auth.signOut().then(() => {
            this.userProfile = null;
        });
    }

    public getLangs(): string[] {
        let res = this.langs.filter(l => l !== this.translate.currentLang);
        return res;
    }

    public onSelectChange(selectedLang: any): void {
        this.translate.use(selectedLang);
    }

    /**
     * Envoi un mail de reinitialisation de mot de passe
     */
    public resetPassword(emailAddress): Promise<boolean> {
        return new Promise((resolve, reject) => {
            var auth = this.fireauth.auth;
            auth.sendPasswordResetEmail(emailAddress).then(() => {
                resolve(true);
            }).catch((error) => {
                reject(error);
            });
        });
    }
}
