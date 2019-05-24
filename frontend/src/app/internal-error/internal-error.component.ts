import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";

@Component({
  selector: "app-internal-error",
  templateUrl: "./internal-error.component.html",
  styleUrls: ["./internal-error.component.css"]
})
export class InternalErrorComponent implements OnInit {
  constructor(private location: Location) {}

  ngOnInit() {}

  onClickOnLink(event) {
    event.preventDefault();
  }

  gotoBack() {
    this.location.back();
  }
}
