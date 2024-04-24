<template>
  <v-dialog v-model="model" :max-width="600">
    <v-card v-if="model && redirectSource">
      <v-card-title class="text-h4 text-center pt-7 pb-4">
        <v-avatar>
          <v-img :src="redirectSource.imageUrl"></v-img>
        </v-avatar>
        {{ redirectSource.productName }}</v-card-title
      >
      <v-card-text>
        <v-alert border class="text-h6 px-4 py-6" icon="mdi-format-align-left" variant="tonal">
          {{ text }}
          <span class="text-primary" v-for="(e, i) in embeds || []" :key="i">
            {{ e }}</span
          >
        </v-alert>
        <v-checkbox
          label="Save this as one of your preferred clients"
          hide-details
        ></v-checkbox>
        <v-checkbox
          :label="`Automatically continue if coming from ${redirectSource.productName}`"
          hide-details
        ></v-checkbox>
      </v-card-text>
      <v-card-actions>
        <v-btn block color="primary" variant="elevated" :href="targetUrl" target="_blank">
          Continue to {{ redirectSource.domain }}
          <v-icon end>mdi-arrow-right-bold</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { defineModel, defineProps, computed, watch, ref } from "vue";
import { IRedirectSource } from "@/sources/types";

const model = defineModel<boolean>();
const props = defineProps<{
  source: Object;
  text: string | undefined;
  embeds: string[] | undefined;
}>();
const targetUrl = ref<string>("");

const redirectSource = computed<IRedirectSource | null>(() => {
  if (!props.source) return null;
  if (!("fulfilmentType" in props.source)) return null;
  if (props.source.fulfilmentType !== "redirect") return null;
  return props.source as IRedirectSource;
});

watch(
  () => model.value,
  (s: boolean | undefined) => {
    if (!s) return;
    if (!redirectSource.value) return;
    targetUrl.value = (redirectSource.value as IRedirectSource).linkGenerator({ text: props.text, embeds: props.embeds });
    if (!props.text && !props.embeds?.length) {
      window.location.href = targetUrl.value || "";
    }
  },
  { immediate: true }
);
</script>
