<script>
import GlyphComponent from "@/components/GlyphComponent";

export default {
  name: "GlyphInventory",
  components: {
    GlyphComponent
  },
  data() {
    return {
      inventory: [],
      newGlyphs: [],
      unequippedGlyphs: [],
      doubleClickTimeOut: null,
      clickedGlyphId: null,
      glyphSacrificeUnlocked: false,
      protectedRows: 0,
    };
  },
  computed: {
    rowCount: () => Glyphs.totalSlots / 10,
    colCount: () => 10,
  },
  created() {
    this.on$(GAME_EVENT.GLYPHS_CHANGED, this.glyphsChanged);
    this.on$(GAME_EVENT.GLYPH_VISUAL_CHANGE, this.glyphsChanged);
    this.glyphsChanged();
  },
  methods: {
    update() {
      this.glyphSacrificeUnlocked = GlyphSacrificeHandler.canSacrifice;
      this.protectedRows = player.reality.glyphs.protectedRows;
      this.newGlyphs = Glyphs.unseen;
      this.unequippedGlyphs = Glyphs.unequipped;
    },
    toIndex(row, col) {
      return (row - 1) * this.colCount + (col - 1);
    },
    allowDrag(event) {
      if (event.dataTransfer.types.includes(GLYPH_MIME_TYPE)) event.preventDefault();
    },
    drop(idx, event) {
      const id = parseInt(event.dataTransfer.getData(GLYPH_MIME_TYPE), 10);
      if (isNaN(id)) return;
      const glyph = Glyphs.findById(id);
      if (!glyph) return;
      Glyphs.moveToSlot(glyph, idx);
    },
    removeGlyph(id, force) {
      GlyphSacrificeHandler.removeGlyph(Glyphs.findById(id), force);
    },
    clickGlyph(col, id) {
      const glyph = Glyphs.findById(id);
      console.log(`Clicked ${col}`);
      // If single click
      if (!this.doubleClickTimeOut) {
        this.doubleClickTimeOut = setTimeout(() => {
          this.clickedGlyphId = null;
          this.doubleClickTimeOut = null;
        }, 200);
        this.clickedGlyphId = id;
        if (!glyph) return;
        if (Glyphs.isMusicGlyph(glyph)) {
          new Audio(`audio/note${col}.mp3`).play();
        }
        // Else it's double click, so equip a glyph
      } else if (this.clickedGlyphId === id) {
        clearTimeout(this.doubleClickTimeOut);
        this.doubleClickTimeOut = null;
        const idx = Glyphs.active.indexOf(null);
        if (idx !== -1) Glyphs.equip(glyph, idx);
      }
    },
    glyphsChanged() {
      this.inventory = Glyphs.inventory.map(GlyphGenerator.copy);
    },
    slotClass(index) {
      return index < Glyphs.protectedSlots ? "c-glyph-inventory__protected-slot" : "c-glyph-inventory__slot";
    },
    isNew(index) {
      return player.options.showNewGlyphIcon && this.newGlyphs.includes(this.inventory[index].id);
    },
    isUnequipped(index) {
      return player.options.showUnequippedGlyphIcon && this.unequippedGlyphs.includes(this.inventory[index].id);
    },
    scrollDown(event, down) {

      var cell = event.target;
      var index = cell.cellIndex;
      var currentRow = cell.parentElement;
      var newRow = down ? currentRow.nextElementSibling : currentRow.previousElementSibling;
      console.log(`Cell: ${cell}, index: ${index}, current row: ${currentRow}, new row: ${newRow}`)
      if (newRow === null) {
        return;
      }
      var newCell = newRow.children[index];
      newCell.focus();



    },
    scrollRight(event, right) {
      var cell = event.target;

      var newCell = right ? cell.nextElementSibling : cell.previousElementSibling;
      if (newCell === null) {
        return;
      }
      newCell.focus();


    }
  }
};
</script>

<template>
  <div v-if="!$viewModel.srMode" class="l-glyph-inventory">
    Click and drag or double-click to equip Glyphs.
    <div v-for="row in rowCount" :key="protectedRows + row" class="l-glyph-inventory__row">
      <div v-for="col in colCount" :key="col" class="l-glyph-inventory__slot" :class="slotClass(toIndex(row, col))"
        @down.down.stop="" @up.down.stop="" @dragover="allowDrag" @drop="drop(toIndex(row, col), $event)">
        <GlyphComponent v-if="inventory[toIndex(row, col)]" :glyph="inventory[toIndex(row, col)]"
          :is-new="isNew(toIndex(row, col))" :is-unequipped="isUnequipped(toIndex(row, col))" :is-inventory-glyph="true"
          :show-sacrifice="glyphSacrificeUnlocked" :draggable="true" @shiftClicked="removeGlyph($event, false)"
          @ctrlShiftClicked="removeGlyph($event, true)" @clicked="clickGlyph(col, $event)" />
      </div>
    </div>
  </div>
  <!-- Yes, you need role="table", works even better than <table>. -->
  <div v-else class="l-glyph-inventory" role="table">
    <tr v-for="row in rowCount" :key="protectedRows + row" class="l-glyph-inventory__row">
      <td v-for="col in colCount" :key="col" class="l-glyph-inventory__slot" :class="slotClass(toIndex(row, col))"
        tabindex="0" @keydown.j="$emit('srInventorySlotSelect', toIndex(row, col))"
        @keydown.delete.exact="$emit('srInventorySlotDelete', toIndex(row, col), false)"
        @keydown.shift.delete="$emit('srInventorySlotDelete', toIndex(row, col), true)"
        @keydown.enter="$emit('srInventorySlotEquip', toIndex(row, col))"
        @keydown.down.prevent.stop="scrollDown($event, true)" @keydown.up.prevent.stop="scrollDown($event, false)"
        @keydown.right.prevent.stop="scrollRight($event, true)" @keydown.left.prevent.stop="scrollRight($event, false)">
        <GlyphComponent v-if="inventory[toIndex(row, col)]" :glyph="inventory[toIndex(row, col)]"
          :is-new="isNew(toIndex(row, col))" :is-unequipped="isUnequipped(toIndex(row, col))" :is-inventory-glyph="true"
          :show-sacrifice="glyphSacrificeUnlocked" :draggable="true">
          <template #srSlot="{ srDescription }">
            <div> {{ srDescription }} </div>
          </template>
        </GlyphComponent>
      </td>
    </tr>
  </div>
</template>

<style scoped></style>
