<script>



export default {
  name: "PerkTreeNode",
  components: {
  },
  props: {
    perk: {
      type: Object,
      required: true
    },
    connectedPerks: {
      type: Array,
      required: true,

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

  computed: {
    config() {
      return this.perk.config;
    },
    description() {
      const shortDesc = this.perk.label;
      const desc = this.perk.config.description;
      if (!this.isAvailableForPurchase) return `${shortDesc} - ${desc} Requirement not met`;
      else if (!this.isBought && this.canBeBought) return `${shortDesc} - ${desc} Buyable`;
      else if (this.isBought) return `${shortDesc} - ${desc} Purchased`;
      else if (!this.canBeBought) return `${shortDesc} - ${desc} Unaffoardable`;
      else if (!this.canBeApplied) return `${shortDesc} - ${desc} Useless`;
    },
    hasChildren() {
      return this.connectedPerks.length > 0;
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
      if (this.expanded && down) {
        node.firstChild.firstChild.focus();
      } else {
        var target = down ? node.nextElementSibling : node.previousElementSibling;
        if (target !== null) {
          target.focus();
        } else if (this.level > 1) {
          if(!down) {
            node.parentElement.parentElement.focus();
          } else {
            // For when the next item is five levels down
            var level = this.level;
            var parent = node;
            while(level > 1) {
              var newParent = parent.parentElement.parentElement;
              var sib = newParent.nextElementSibling;
              if(sib !== null) {
                sib.focus();
                return;
              }
              level -= 1;
              parent = newParent;


            }

          }
        }
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
  <button role="treeitem" tabindex="-1" ref="node" :aria-level="level"
    :aria-expanded="hasChildren ? expanded ? 'true' : 'false' : null" :aria-selected="isFocused"
    :aria-label="description"" @keydown.right.stop.prevent="goRight" @keydown.left.stop.prevent="goLeft"
    @focus="isFocused = true" @blur="isFocused = false" @keydown.up.stop.prevent="scroll(false)"
    @keydown.down.stop.prevent="scroll(true)" @click="perk.purchase()">
    <ul role="group" ref="group">
      <template v-if="expanded">
        <PerkTreeNode v-for="childPerk in connectedPerks" :key="childPerk.perk.id" :level="level + 1" :perk="childPerk.perk"
          :connectedPerks="childPerk.connectedPerks" />
      </template>
    </ul>

  </button>
</template>

<style scoped></style>
