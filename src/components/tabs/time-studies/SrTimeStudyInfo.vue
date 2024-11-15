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
      const reqs = this.study.config.requirement;
      const reqType = this.study.config.reqType;
      const needsAll = reqType !== TS_REQUIREMENT_TYPE.AT_LEAST_ONE;
      if (reqs.length == 0) return "";
      let studyIds = [];
      let unmetRequirements = 0;
      for (const i of reqs) {

        if(i instanceof Function) {
          if(!i()) {
            unmetRequirements += 1;
          }
        } else {
          studyIds.push(i);
        }
      }
      let text;
      if(studyIds.length > 0) {
        let joinedIds = studyIds.join(", ");
        if(studyIds.length == 1) {
          text = `Needs ${joinedIds}`;
        } else {
          text = `${needsAll ? "Needs all of" : "Needs one of"} ${joinedIds}`;
        }

        if(unmetRequirements > 0) {
          text += `, +${unmetRequirements} unmet requirements`;
        }
        return text;
      } else if(unmetRequirements > 0) {
        return needsAll ? `${unmetRequirements} unmet requirements` : `Need at least 1 of ${unmetRequirements} unmet requirements`;
      }
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
