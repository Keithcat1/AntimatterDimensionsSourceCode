<script>
import EffectDisplay from "@/components/EffectDisplay";

export default {
  name: "AlchemyResourceInfo",
  components: {
    EffectDisplay
  },
  props: {
    resource: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      amount: 0,
      cap: 0,
      capped: false,
      flow: 0,
      isReactionActive: false,
      reactionProduction: 0,
      isUnlocked: false,
      unlockRequirement: ""
    };
  },
  computed: {
    classObject() {
      return {
        "c-alchemy-resource-info": true,
        "c-alchemy-resource-info--locked": !this.isUnlocked
      };
    },
    reaction() {
      return this.resource.reaction;
    },
    isBaseResource() {
      return this.resource.isBaseResource;
    },
    reactionText() {
      if (this.resource === AlchemyResource.reality) return this.realityReactionText;
      const reagents = this.reaction.reagents
        .map(r => `${format(r.cost)}${this.srSymbol(r.resource)}`)
        .join(" + ");
      return `${reagents} ${this.srEquals} ${format(this.reactionProduction, 2, 2)}${this.srSymbol(this.resource)}`;
    },
    realityReactionText() {
      const reagents = this.reaction.reagents
        .map(r => this.srSymbol(r.resource))
        .join(" + ");
      return `${reagents} ${srEquals} ${this.srSymbol(this.resource)}`;
    },
    effectConfig() {
      const resource = this.resource;
      return {
        effect: () => resource.effectValue,
        formatEffect: resource.config.formatEffect
      };
    },
    resourceAmount() {
      return formatFloat(this.amount, 1);
    },
    resourceCap() {
      return formatFloat(this.cap, 1);
    },
    formattedFlow() {
      const sign = this.flow >= 0 ? "+" : "-";
      if (Math.abs(this.flow) < 0.01) return "None";
      const resourceText = `${sign}${format(Math.abs(this.flow), 2, 2)}/sec`;
      const color = this.flow > 0 ? "9CCC65" : "CC6666";
      return `<span style="color:#${color}">${resourceText}</span>`;
    },
    srEquals() {
      return this.$viewModel.srMode ? "=" : "➜";
    },
    isDoomed: () => Pelle.isDoomed,
  },
  methods: {
    update() {
      const resource = this.resource;
      this.amount = resource.amount;
      this.cap = resource.cap;
      this.capped = resource.capped;
      this.flow = resource.flow;
      this.isUnlocked = resource.isUnlocked;
      this.unlockRequirement = resource.lockText;
      if (!this.isBaseResource) {
        this.isReactionActive = !this.isDoomed && this.reaction.isActive;
        this.reactionProduction = this.reaction.reactionProduction;
      }
    },
    srToggleReaction() {
      this.reaction.isActive = !this.reaction.isActive;
    },
    srSymbol(resource) {
      return this.$viewModel.srMode ? resource.name : resource.symbol;
    },
  }
};
</script>

<template>
  <div
    v-if="isUnlocked"
    :class="classObject"
  >
    <span v-if="!$viewModel.srMode" class="c-alchemy-resource-info__title">
      {{ resource.symbol }} {{ resource.name }} {{ resource.symbol }}
    </span>
    <span v-else>
      {{ resource.name }}
    </span>
    <span v-if="isDoomed">
      Destroyed by Pelle
    </span>
    <span v-else>
      {{ capped ? "Capped" : "Current" }}: {{ resourceAmount }}/{{ resourceCap }}
      (Recent change: <span v-html="formattedFlow" />)
    </span>
    <br v-if="$viewModel.srMode">
    <span v-if="isBaseResource">Base Resource</span>
    <span v-else>Reaction: {{ isReactionActive ? "Active" : "Inactive" }} ({{ reactionText }})
    <input v-if="$viewModel.srMode" type="checkbox" :value="isReactionActive" @change="srToggleReaction" aria-label="reaction"></input>
</span>
    <span :class="{ 'o-pelle-disabled': isDoomed }">
      <EffectDisplay
        label="Effect"
        :config="effectConfig"
      />
    </span>
  </div>
  <div
    v-else
    :class="classObject"
  >
    Unlock requirement: {{ unlockRequirement }}
  </div>
</template>

<style scoped>

</style>
