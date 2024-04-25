<template>
  <v-responsive class="align-centerfill-height mx-auto pt-8" style="max-width: 900px">
    
    <ComposeHeader :referrerUrl="referrerUrl"></ComposeHeader>

    <v-row class="px-3 pt-4">
      <v-col cols="12" class="pb-0">
        <v-card class="py-4" color="transparent">
          <ComposeForm
            v-model:text="text"
            v-model:embeds="embeds"
            v-model:targetSourceKey="targetSourceKey"
            :sources="sources"
          ></ComposeForm>
        </v-card>
      </v-col>
    </v-row>
  </v-responsive>

  <v-row class="mt-7 px-3">
    <v-col xs="12" sm="12" md="6" lg="4" xl="3" v-for="(opt, i) in sources" :key="i">
      <SourceCard :value="opt" @click="chooseOption(opt)"></SourceCard>
    </v-col>
  </v-row>

  <RedirectSourceDialog
    v-model="isShowingRedirectDialog"
    :text="text"
    :embeds="embeds"
    :source="targetSource"
  ></RedirectSourceDialog>

  <PromptCopySourceDialog
    v-model="isShowingCopyFirstDialog"
    :text="text"
    :embeds="embeds"
    :source="targetSource"
  ></PromptCopySourceDialog>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineModel, watch } from "vue";
import { orderedSources, ISource } from "@/sources/index";

const props = defineProps<{ referrerUrl: string | null; preferred: string[] }>();
const text = defineModel<string>("text", { type: String });
const embeds = defineModel<string[]>("embeds", { type: Array });

const sources = computed<ISource[]>(() => {
  return orderedSources({
    referrer: props.referrerUrl,
    preferences: props.preferred,
  });
});

const isShowingRedirectDialog = ref(false);
const isShowingCopyFirstDialog = ref(false);
const targetSourceKey = ref<string | null>(null);
const targetSource = ref<ISource | null>(null);

const chooseOption = (source: ISource | null) => {
  targetSource.value = source;
  targetSourceKey.value = source?.domain || null;
};

watch(
  targetSourceKey,
  (sourceKey: string | null) => {
    if (!sourceKey) {
      targetSource.value = null;
    } else {
      const matchingSource = sources.value.find((s: ISource) => s.domain === sourceKey);
      targetSource.value = matchingSource || null;
    }
  },
  { immediate: true }
);

watch(
  targetSource,
  (source: ISource | null) => {
    if (!source) return;
    if (source.fulfilmentType === "redirect") {
      isShowingRedirectDialog.value = true;
    } else if (source.fulfilmentType === "promptCopy") {
      isShowingCopyFirstDialog.value = true;
    } else {
      throw new Error("Unsupported fulfillmentType");
    }
  },
  { immediate: true }
);

watch(
  () => props.referrerUrl,
  (url: string | null) => {
    if (!url || !sources.value) return;
    const [first] = sources.value;
    if (
      props.referrerUrl &&
      first.preferenceCondition &&
      first.preferenceCondition({ url: new URL(url) })
    ) {
      chooseOption(first);
    }
  },
  { immediate: true }
);
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
