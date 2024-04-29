<template>
  <v-responsive class="align-centerfill-height mx-auto pt-8" style="max-width: 900px">
    <ComposeHeader :referrerUrl="referrerUrl"></ComposeHeader>

    <v-row class="px-3 pt-4">
      <v-col cols="12" class="pb-0">
        <v-card class="py-4" color="transparent" flat>
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

  <v-row class="mt-7 px-3 mx-auto sources-row">
    <v-col cols="12" sm="12" md="6" lg="4" xl="3" v-for="(opt, i) in sources" :key="i">
      <SourceCard
        :image-tile="opt.imageTile"
        :image-url="opt.imageUrl"
        :domain="opt.domain"
        :is-referred="opt.isReferred"
        :is-preferred="opt.isPreferred"
        v-model:isStarred="opt.isStarred"
        :product-name="opt.productName"
        @click="chooseOption(opt)"
      ></SourceCard>
    </v-col>
  </v-row>

  <PromptCopySourceDialog
    v-model="isShowingCopyFirstDialog"
    :text="text"
    :embeds="embeds"
    :source="targetSource"
  ></PromptCopySourceDialog>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineModel, watch } from "vue";
import { orderedSources, ISource, IOrderedSource } from "@/sources/index";
import ComposeCastDb from "../databases/composeCastDb";
import { getSourceConfig } from "../databases/sourceConfig";

const props = defineProps<{
  referrerUrl: string | null;
  preferred: string[];
  starred: string[];
}>();
const text = defineModel<string>("text", { type: String });
const embeds = defineModel<string[]>("embeds", { type: Array });

const orderDefinition = computed(() => ({
  referrer: props.referrerUrl,
  preferences: props.preferred,
  starred: props.starred,
}));
const sources = ref<IOrderedSource[]>([]);
const isShowingCopyFirstDialog = ref(false);
const targetSourceKey = ref<string | null>(null);
const targetSource = ref<IOrderedSource | null>(null);

const chooseOption = (source: IOrderedSource | null) => {
  targetSource.value = source;
  targetSourceKey.value = source?.domain || null;
};

watch(orderDefinition, () => (sources.value = orderedSources(orderDefinition.value)), {
  immediate: true,
  deep: true,
});

watch(
  targetSourceKey,
  (sourceKey: string | null) => {
    if (!sourceKey) {
      targetSource.value = null;
    } else {
      const matchingSource = sources.value.find(
        (s: IOrderedSource) => s.domain === sourceKey
      );
      targetSource.value = matchingSource || null;
    }
  },
  { immediate: true }
);

watch(
  targetSource,
  async (source: ISource | null) => {
    if (!source) return;
    if (source.fulfilmentType === "redirect") {
      const cfg = await getSourceConfig(ComposeCastDb, source.domain);
      // Default behaviour is to redirect, must be configured out.
      if (!cfg || cfg.automaticallyContinue) {
        window.location.href = source
          .linkGenerator({ text: text.value, embeds: embeds.value })
          .toString();
      }
    } else if (source.fulfilmentType === "promptCopy") {
      // If there is no content there's no point in prompting for copy.
      if (!text.value && !embeds.value?.length) {
        window.location.href = source
          .linkGenerator({ text: text.value, embeds: embeds.value })
          .toString();
      } else {
        isShowingCopyFirstDialog.value = true;
      }
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
    if (props.referrerUrl && first.isReferred) {
      chooseOption(first);
    }
  },
  { immediate: true }
);
</script>
<style scoped>
.sources-row {
  max-width: 1600px;
}
</style>
