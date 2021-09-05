import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

declare let ml5: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],

})

export class AppComponent implements OnInit {

  model : any;

  currentTime : number = 0;

  @ViewChild('img', {static: true}) imgElement: any;

  @ViewChild('videoRef', {static: true}) videoRef:any
  @ViewChild('svgRef', {static: true}) svgRef: any;

  currentDetections: any[] =[];

  videoBoundingRect : any;
  svgEnabled = true;

  seekedTime : number = 0;

  frameRate = 30;

  startTime = new Date();

  operationDuration  = 0;

  remainigDuration : number = 0;


  constructor(private cdRef: ChangeDetectorRef) {
  }

  async ngOnInit() {

    this.model = await ml5.objectDetector('cocossd');   
    
    this.detectFrame();
    console.log("objectDetector Initilized");

     let self = this;
    // this.videoRef.nativeElement.addEventListener('loadeddata', function() {  
    //   console.log("loaded data");    
    //   if(self.videoRef.nativeElement.readyState >= 2) {
    //     console.log("player ready");
    //     //self.detectFrame();
    //   }    
    // });

    this.startTime = new Date();

    this.videoRef.nativeElement.addEventListener('seeked', function() {  
      //console.log("seeked video data");    
      if(self.videoRef.nativeElement.readyState >= 2) {
      //  console.log("seeked player ready");
        self.detectFrame();
      }    
    });

    // requestAnimationFrame(async () => {
    //   await this.detectFrame();
    // });
  }

  public loadedMetaData(){

  }

  title = 'objectDetections';

  public async detectObjects(){
    this.model.detect(this.imgElement.nativeElement, (err : any, results : any)=>{
      console.log(results);
   
    });
  }

  public async detectVideoFrames(){   
    
    let duration = this.videoRef.nativeElement.duration;
    this.seekedTime++;
    if (this.seekedTime > 60 * this.frameRate){
      return;
    }

    this.operationDuration = new Date().getTime() - this.startTime.getTime();

    this.remainigDuration = (duration * this.frameRate) - this.seekedTime
    let value  = (this.seekedTime /this.frameRate).toFixed(2);
    this.videoRef.nativeElement.currentTime = value ;
  }


  async onVideoCanPlay() {
    this.videoBoundingRect = this.videoRef.nativeElement.getBoundingClientRect();
  }

  public detectFrame() {

    if (this.model) {
        this.model.detect(this.videoRef.nativeElement).then((results :any, error : any) =>{
            this.currentDetections = results;
            this.cdRef.markForCheck();
            this.detectVideoFrames();
        });       
    }
  }

  toggleSvgOverlay() {
    this.svgEnabled = !this.svgEnabled;
  }
}
