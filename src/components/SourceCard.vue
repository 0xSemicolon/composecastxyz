<template>
  <v-card
    class="py-4"
    color="surface"
    append-icon="mdi-open-in-new"
    rel="noopener noreferrer"
    rounded="lg"
    :subtitle="`Continue with ${value?.domain || '...'}`"
    target="_blank"
    :title="value.productName || '...'"
  >
    <template #prepend>
      <v-avatar v-if="value">
        <v-img :src="value.imageUrl"></v-img>
      </v-avatar>
    </template>
  </v-card>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'
import { ISource } from "@/sources/index";
defineProps<{ value: ISource | undefined }>();
</script>
