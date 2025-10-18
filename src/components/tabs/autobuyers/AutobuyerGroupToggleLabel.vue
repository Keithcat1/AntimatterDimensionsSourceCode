<script>
import AutobuyerToggleLabel from "./AutobuyerToggleLabel";

export default {
  name: "AutobuyerGroupToggleLabel",
  components: {
    AutobuyerToggleLabel
  },
  props: {
    isActive: Boolean,
    name: {
      type: String,
      required: true,
    }
  },
  data() {
    return {
      isDisabled: false,
    };
  },
  methods: {
    update() {
      this.isDisabled = !player.auto.autobuyersOn;
    },
  }
};
</script>

<template>
  <h2 v-if="$viewModel.srMode"> {{ name }} </h2>
  <AutobuyerToggleLabel
    :is-active="isActive"
    :is-disabled="isDisabled"
    :name="name"
    @click="emitClick"
  />
</template>

<style scoped>

</style>
