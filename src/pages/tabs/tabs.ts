import { Component, ViewChild } from '@angular/core';

import { AboutPage } from '../about/about';
import { LoginPage } from '../login/login';
import { HomePage } from '../home/home';

import { Select } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { LoggerProvider } from '../../providers/logger/logger';

@Component({
    templateUrl: 'tabs.html'
})
export class TabsPage {
    @ViewChild('sectionSelect') sectionSelect: Select;

    private isConnected: boolean = false;
    private tab1Root = LoginPage;
    private tab2Root = HomePage;
    private tab3Root = AboutPage;

    constructor(public logger: LoggerProvider, public translate: TranslateService) {
        this.translate.use('fr');
        logger.events.subscribe('user:connected', (userProfile) => {
            this.isConnected = true;
        });
        logger.events.subscribe('user:disconnected', () => {
            this.isConnected = false;
        });
    }

    public doLangSelection(): void {
        this.sectionSelect.open();
    }
}
