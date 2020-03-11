import { Component } from "@angular/core";
import { ToastController } from "@ionic/angular";
import { AngularFirestore } from "@angular/fire/firestore";
import { AngularFireFunctions } from "@angular/fire/functions";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"]
})
export class HomePage {
  userdata = {
    email: "",
    first_name: ""
  };
  constructor(
    private toastCtrl: ToastController,
    private db: AngularFirestore,
    private functions: AngularFireFunctions
  ) {}

  subscribeTriggered() {
    this.db
      .collection("subscribers")
      .add({
        email: this.userdata.email,
        first_name: this.userdata.first_name
      })
      .then(
        res => {
          this.showToast("You are now subscribed!");
        },
        err => {
          console.error("An error occurred: ", err);
        }
      );
  }

  subscribeDirectly() {
    const callable = this.functions.httpsCallable("addSubscriber");
    const obs = callable({
      email: this.userdata.email,
      first_name: this.userdata.first_name
    });
    obs.subscribe(res => {
      this.showToast(res.msg);
    });
  }

  async showToast(msg) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }
}
