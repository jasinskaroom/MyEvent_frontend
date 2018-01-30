import { NgModule } from '@angular/core';
import { AppContentComponent } from './app-content/app-content';
import { IonicImageLoader } from 'ionic-image-loader';
import { CommonModule } from '@angular/common';
import { ImgCacheModule } from 'ng-imgcache';



@NgModule({
	declarations: [AppContentComponent],
	imports: [IonicImageLoader, CommonModule,ImgCacheModule],
	exports: [AppContentComponent]
})
export class ComponentsModule {}
