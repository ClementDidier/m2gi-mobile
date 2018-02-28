import { Component } from '@angular/core';

import { AboutPage } from '../about/about';
import { LoginPage } from '../login/login';
import { HomePage } from '../home/home';

import { LoggerProvider } from '../../providers/logger/logger';

@Component({
    templateUrl: 'tabs.html'
})
export class TabsPage {

    private isConnected: boolean = false;
    private tab1Root = LoginPage;
    private tab2Root = HomePage;
    private tab3Root = AboutPage;

    constructor(public logger: LoggerProvider) {
        logger.events.subscribe('user:connected', (userProfile) => {
            this.isConnected = true;
        });
        logger.events.subscribe('user:disconnected', () => {
            this.isConnected = false;
        });
    }
}
