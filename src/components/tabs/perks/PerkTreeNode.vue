<script>
var displayedPerks = new Set();
export default {
  name: "PerkTreeNode",
  components: {
  },
  props: {
    perk: {
      type: Object,
      required: true
    },
    level: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      canBeApplied: false,
      isAvailableForPurchase: false,
      automatorPoints: 0,
      canBeBought: false,
      isBought: false,
      isPossible: false,
      expanded: false,
      isFocused: false,
    };
  },
  mounted() {
    console.log(`Added ${this.perk.id}`)
    displayedPerks.add(this.perk.id);

  },
  beforeDestroy() {
    console.log(`Removing ${this.perk.id}`);
    displayedPerks.delete(this.perk.id);
  },
  computed: {
    config() {
      return this.perk.config;
    },
    description() {
      const shortDesc = this.perk.label;
      const desc = this.perk.config.description;
      if (!this.isAvailableForPurchase) return `${shortDesc} - ${desc}, requirement not met`;
      else if (!this.canBeBought) return `${shortDesc} - ${desc}, unaffordable`;
      else if (!this.isBought) return `${shortDesc} - ${desc}, buyable`;
      else if (!this.canBeApplied) return `${shortDesc} - ${desc}, useless`;
      else return `${shortDesc} - ${desc}, purchased`;

    },
    hasChildren() {
      return this.perk.connectedPerks.length > 0;
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
    scroll(down) {
      var node = this.$refs.node;
      var target = down ? node.nextElementSibling : node.previousElementSibling;
      if (target !== null) {
        //target.focus();
      } else if (this.level > 1) {
        //node.parentElement.focus();
      }
    },
    goRight() {
      if (!this.hasChildren) return;
      if (this.expanded) {
        this.$refs.group.children[0].focus();
      } else {
        this.expanded = true;
      }
    },
    goLeft() {
      if (!this.expanded) {
        this.$refs.node.parentElement.parentElement.focus();
      } else {
        this.expanded = false;
      }
    },
  },
};
</script>

<template>
  <li role="treeitem" tabindex="-1" ref="node" :aria-level="level" :aria-expanded="expanded ? 'true' : 'false'"
    :aria-selected="isFocused" @keydown.right.stop="goRight" @keydown.left.stop="goLeft" @focus="isFocused = true"
    @blur="isFocused = false" @keydown.up.stop="scroll(false)" @keydown.down.stop="scroll(true)"
    @click="perk.purchase()">
    {{ description }}
    <ul role="group" ref="group">
      <template v-if="expanded">
        <PerkTreeNode v-for="childPerk in perk.connectedPerks.filter((value) => !displayedPerks.has(value.id))" :key="childPerk.id" :level="level + 1"
          :perk="childPerk"/>
      </template>
    </ul>

  </li>
</template>

<style scoped></style>
