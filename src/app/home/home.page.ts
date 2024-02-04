import { Component, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  @ViewChild('videoElement', { static: true }) videoElement: ElementRef | any;
  @ViewChild('recordedVideoElement', { static: true }) recordedVideoElement: ElementRef | any;

  recording: boolean = false;
  mediaRecorder: MediaRecorder | any;
  recordedChunks: Blob[] = [];

  async ngOnInit() {

    const constraints = {
      video: { facingMode: { exact: 'environment' } },
      audio: true,
    };

    const stream = await navigator.mediaDevices.getUserMedia(constraints);

    // Access to media devices granted, continue with your code
    const videoElement: HTMLVideoElement = this.videoElement.nativeElement;
    videoElement.srcObject = stream;
    videoElement.play();
    videoElement.muted = true;

    this.mediaRecorder = new MediaRecorder(stream);
    this.mediaRecorder.ondataavailable = (event: any) => {
      if (event.data.size > 0) {
        this.recordedChunks.push(event.data);
      }
    };

    this.mediaRecorder.onstop = () => {
      const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      URL.revokeObjectURL(url);
      this.recordedChunks = [];
      this.recording = false;

      // After stopping the recording, play the recorded video
      const recordedVideoElement: HTMLVideoElement = this.recordedVideoElement.nativeElement;
      recordedVideoElement.src = URL.createObjectURL(blob);
      recordedVideoElement.play();
    };
  }

  startRecording() {
    this.mediaRecorder.start();
    this.recording = true;
  }

  stopRecording() {
    this.mediaRecorder.stop();
    this.recording = false;
  }

  // downloadRecordedVideo() {
  //   // // Create a new Blob with the recorded chunks
  //   // const blob = new Blob(this.recordedChunks, { type: 'video/webm' });

  //   // // Use FileSaver.js to trigger the download
  //   // saveAs(blob, 'recorded_video.webm');

  //   // // Clear recordedChunks so that the download button gets disabled
  //   // this.recordedChunks = [];
  // }

}
