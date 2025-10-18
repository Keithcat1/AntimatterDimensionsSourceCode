<script>
import ModalCloseButton from "@/components/modals/ModalCloseButton";

export default {
  name: "ModalWrapper",
  components: {
    ModalCloseButton,
  },
  methods: {
    closeModal() {
      EventHub.dispatch(GAME_EVENT.CLOSE_MODAL);
    }
  }
};
</script>

<template>
  <div class="c-modal__inner">
    <div class="c-modal__header">
      <ModalCloseButton @click="closeModal" />
      <template v-if="!$viewModel.srMode">
        <span
          v-if="$slots.header"
          class="c-modal__title"
        >
          <slot name="header" />
        </span>
      </template>
      <div v-else role="alert">
        <span
          v-if="$slots.header"
          class="c-modal__title"
        >
          <slot name="header" />
        </span>
      </div>
    </div>
    <slot />
  </div>
</template>

<style scoped>
.c-modal__header {
  margin-bottom: 0.5rem;
}
</style>