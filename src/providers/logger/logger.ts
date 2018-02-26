import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';
import { FIREBASE_CREDENTIALS } from '../../firebase.credentials';
import { AngularFireAuth } from 'angularfire2/auth';
import { GooglePlus } from '@ionic-native/google-plus';

/*
Generated class for the LoggerProvider provider.

See https://angular.io/guide/dependency-injection for more info on providers
and Angular DI.
*/
@Injectable()
export class LoggerProvider {

    private userProfile: firebase.User
    public displayName: string;

    constructor(private fireauth: AngularFireAuth, private googlePlus: GooglePlus) {
        this.fireauth.authState.subscribe(res => {
            if (res && res.uid) {
                this.userProfile = res;
                this.displayName = res.displayName;
            } else {
                this.userProfile = null;
                this.displayName = null;
            }
        });
    }

    public isLogged(): boolean {
        return this.userProfile !== null;
    }

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

    public googleLogIn() {
        return new Promise((resolve, reject) => {
            this.googlePlus.login({
                webClientId: FIREBASE_CREDENTIALS.webClientId,
                offline: true
            }).then(res => {
                const firecreds = firebase.auth.GoogleAuthProvider.credential(res.idToken);
                this.fireauth.auth.signInWithCredential(firecreds).then((res) => {
                    resolve(res);
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
}
