<template>
  <v-form>
    <template v-if="text || (embeds && embeds.length)">
      <v-textarea
        variant="solo"
        prepend-icon="mdi-message-outline"
        placeholder="..."
        class="text-h6"
        rounded
        v-model="text"
        hide-details
        no-resize
        autofocus
      >
      </v-textarea>
      <v-select
        v-if="embeds?.length"
        v-model="embeds"
        prepend-icon="mdi-shape-plus"
        variant="solo"
        placeholder="Embeds"
        rounded
        class="mt-3 text-h6"
        menu-icon
        hide-details
        readonly
      >
        <template v-slot:selection="{ item }">
          <v-chip color="blue">{{ item.title }}</v-chip>
        </template></v-select
      >
    </template>
    <v-autocomplete
      v-model="targetSourceKey"
      :items="sources || []"
      item-title="productName"
      item-value="domain"
      variant="solo"
      placeholder="Search source"
      rounded
      class="mt-3 text-h6"
      hide-details
      clearable
    >
      <template #prepend>
        <v-icon>mdi-magnify</v-icon>
      </template>
      <template v-slot:item="{ props, item }">
        <v-list-item
          v-bind="props"
          :prepend-avatar="item.raw.imageUrl"
          :subtitle="`Continue with ${item.raw.domain}`"
          :title="item.raw.productName"
        ></v-list-item>
      </template>
    </v-autocomplete>
  </v-form>
</template>

<script lang="ts" setup>
import { ref, computed, defineProps, defineModel, watch } from "vue";
import { orderedSources, ISource } from "@/sources/index";
const props = defineProps<{
  sources: ISource[] | undefined;
}>();
const text = defineModel<string>("text", { type: String });
const embeds = defineModel<string[]>("embeds", { type: Array });
const targetSourceKey = defineModel<string>("targetSourceKey", { type: String });
</script>

<style scoped>
.compose-prompt {
  text-wrap: wrap;
}
.text-h6 >>> textarea,
.text-h6 >>> .v-chip {
  font-size: 1.25rem !important;
}
</style>
