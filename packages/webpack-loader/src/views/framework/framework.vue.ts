import { Component, Vue } from "vue-property-decorator";
import { State } from "vuex-class";

@Component
export default class FrameWork extends Vue {
  protected msg = "Example";

  @State("text") text!: string;

  protected toast() {
    window?.alert("ExampleMessage");
  }

  protected setVuexValue() {
    this.$store.commit("setText", "New Value");
  }
}
