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
  }),
  computed: {
    // Which studies any given study requires may not be obvious, so generate a description here for screen readers
    srConnections() {
      const reqs = this.study.config.requirement;
      const reqType = this.study.config.reqType;
      const needsAll = reqType !== TS_REQUIREMENT_TYPE.AT_LEAST_ONE;
      if (reqs.length === 0) return null;
      const studyIds = [];
      let specialReqs = [];
      for (const i of reqs) {
        if (i instanceof Function === false) {
          studyIds.push(i);
        } else {
            let result = i();
            if(typeof result === "string") {
                specialReqs.push(result);
            }
        }
      }
      let text;
      let special = specialReqs.join(", ");
      if (studyIds.length > 0) {
        const joinedIds = studyIds.join(", ");
        if (studyIds.length === 1) {
          text = `Needs ${joinedIds}`;
        } else {
          text = `${needsAll ? "Needs all of" : "Needs one of"} ${joinedIds}`;
        }
        if (specialReqs.length > 0) {
          text += `, ${special}`
        }
        return text;
      }
      return null;
    }
  },
  methods: {
    update() {
      this.isBought = this.study.isBought;
    },
  },
};
</script>

<template>
  <div>
    <div v-if="isBought">
      owned
    </div>
    <div v-if="isUseless">Doomed by Pelle</div>
    <div v-if="hasConnections">
      {{ srConnections }}
    </div>
  </div>
</template>

<style scoped>

</style>
