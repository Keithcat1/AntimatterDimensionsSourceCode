<script>
export default {
  name: "SrTimeStudyInfo",

  props: {
    hasConnections: {
      type: Boolean,
      default: true,
    },
    isNormal: {
      type: Boolean,
      default: false,
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
    unmetRequirements: 0,
  }),
  computed: {
    // Which studies any given study requires may not be obvious, so generate a description here for screen readers
    srConnections() {
      const reqs = this.study.config.requirement;
      const reqType = this.study.config.reqType;
      const needsAll = reqType !== TS_REQUIREMENT_TYPE.AT_LEAST_ONE;
      if (reqs.length === 0) return null;
      const studyIds = [];
      for (const i of reqs) {
        if (i instanceof Function === false) {
          studyIds.push(i);
        }
      }
      let text;
      if (studyIds.length > 0) {
        const joinedIds = studyIds.join(", ");
        if (studyIds.length === 1) {
          text = `Needs ${joinedIds}`;
        } else {
          text = `${needsAll ? "Needs all of" : "Needs one of"} ${joinedIds}`;
        }
        if (this.unmetRequirements > 0) {
          text += `, +${this.unmetRequirements} unmet requirements`;
        }
        return text;
      }
      if (unmetRequirements > 0) {
        return needsAll ? `${this.unmetRequirements} unmet requirements` : `Need at least 1 of ${this.unmetRequirements} unmet requirements`;
      }
      return null;
    }
  },
  methods: {
    update() {
      this.isBought = this.study.isBought;
      // Only normal studies have requirements
      if (this.isNormal) {
        let unmetRequirements = 0;
        for (const requirement of this.study.config.requirement) {
          if (requirement instanceof Function && requirement() === false) {
            unmetRequirements += 1;
          }
        }
        this.unmetRequirements = unmetRequirements;
      }
    },
  },
};
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
