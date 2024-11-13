<script>

export default {
  name: "SrTimeStudyInfo",

  props: {
    hasConnections: {
      type: Boolean,
      default: true,
    },
    study: {
      type: Object,
      required: true,
    },
   isUseless: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    isBought: false,
  }),
  methods: {
    update() {
      this.isBought = this.study.isBought;
    },
  },
  computed: {
      // Which studies any given study requires may not be obvious, so generate a description here for screen readers
    srConnections() {
      const reqs = this.study.config.requirement.filter(v => typeof v === "number");
      const reqType = this.study.config.reqType;
      const needsAll = reqType !== TS_REQUIREMENT_TYPE.AT_LEAST_ONE;
      if (reqs.length == 0) return "";
      let text = `Need `;
      if (reqs.length == 1) {
        text += ` ${reqs[0]}`;
      } else {
        for (let i = 0; i < reqs.length; i++) {
          if (i == reqs.length - 1) text += needsAll ? " and " : " or ";
          else if (i > 0) text += ", ";
          text += reqs[i];
        }
      }
      return text;
    }
  },
}

</script>

<template>
  <div>
    <div v-if="isUseless">
      doomed
    </div>
    <div v-else-if="isBought">
      owned
   </div>
    <div v-if="hasConnections">
      {{ srConnections }}
    </div>
  </div>

</template>

<style scoped>

</style>
