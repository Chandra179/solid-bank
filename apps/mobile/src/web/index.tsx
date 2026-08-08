import { AppRegistry } from "react-native";
import App from "../../App";

AppRegistry.registerComponent("DigitalBank", () => App);
AppRegistry.runApplication("DigitalBank", {
  rootTag: document.getElementById("root"),
});
