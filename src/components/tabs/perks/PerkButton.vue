<script>
import CostDisplay from "@/components/CostDisplay";
import DescriptionDisplay from "@/components/DescriptionDisplay";
import PrimaryToggleButton from "@/components/PrimaryToggleButton";

export default {
  name: "PerkButton",
  components: {
    DescriptionDisplay,
    CostDisplay,
  },
  props: {
    perk: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      canBeApplied: false,
      isAvailableForPurchase: false,
      automatorPoints: 0,
      canBeBought: false,
      isBought: false,
      isPossible: false,
    };
  },
  computed: {
    config() {
      return this.perk.config;
    },
  },
  methods: {
    update() {
      const perk = this.perk;
      this.canBeApplied = perk.canBeApplied;
      this.isAvailableForPurchase = perk.isAvailableForPurchase;
      this.automatorPoints = perk.automatorPoints;
      this.canBeBought = perk.canBeBought;
      this.isBought = perk.isBought;
    },
  }
};
</script>

<template>
  <div class="l-spoon-btn-group">
    <button
      v-if="isAvailableForPurchase"
      @click="perk.purchase()"
    >
      {{ config.label }}
      <br>
      <span>
        <DescriptionDisplay :config="config" />

        <br>
        <CostDisplay
          v-if="!isBought"
          :config="perk"
          br
          name="Perk Point"
        />
        <b v-if="automatorPoints && !isBought">
          (+{{ formatInt(automatorPoints) }} AP)
        </b>
      </span>
    </button>
  </div>
</template>

<style scoped>

</style>
