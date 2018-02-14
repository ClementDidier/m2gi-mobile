import { Component } from '@angular/core';

import { AboutPage } from '../about/about';
import { LoginPage } from '../login/login';
import { HomePage } from '../home/home';

@Component({
    templateUrl: 'tabs.html'
})
export class TabsPage {

    private tab1Root = LoginPage;
    private tab2Root = HomePage;
    private tab3Root = AboutPage;

    constructor() {

    }
}
