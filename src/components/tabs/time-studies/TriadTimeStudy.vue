<script>
import DescriptionDisplay from "@/components/DescriptionDisplay";
import EffectDisplay from "@/components/EffectDisplay";
import HintText from "@/components/HintText";
import TimeStudyButton from "./TimeStudyButton";
import SrTimeStudyInfo from "./SrTimeStudyInfo";
export default {
  name: "TriadTimeStudy",
  components: {
    DescriptionDisplay,
    EffectDisplay,
    HintText,
    TimeStudyButton,
  SrTimeStudyInfo
  },
  props: {
    setup: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isBought: false,
    };
  },
  computed: {
    study() {
      return this.setup.study;
    },
    id() {
      return this.study.id;
    },
    config() {
      return this.study.config;
    },
  },
  methods: {
    update() {
      this.isBought = this.study.isBought;
    },
  },
};
</script>

<template>
  <TimeStudyButton
    :setup="setup"
    class="o-time-study--triad"
    :show-st-cost="true"
  >
    <HintText
      type="studies"
      class="l-hint-text--time-study"
    >
      {{ id }} Triad
    </HintText>
<SrTimeStudyInfo v-if="$viewModel.srMode" :study="study"/>
    <DescriptionDisplay :config="study.config" />
    <EffectDisplay
      br
      :config="study.config"
    />
  </TimeStudyButton>
</template>

<style scoped>

</style>
