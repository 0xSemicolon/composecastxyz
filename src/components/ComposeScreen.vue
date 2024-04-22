<template>
  <v-container class="fill-height">
    <v-responsive class="align-centerfill-height mx-auto" max-width="900">
      <v-img class="mb-4 mt-10" height="70" src="/images/farcaster.svg" />

      <div class="text-center">
        <div class="text-body-1 font-weight-light mb-n1">
          {{ topText }}
        </div>

        <h1 class="text-h4 font-weight-bold">Compose a cast</h1>
      </div>

      <div class="py-4" />

      <v-row>
        <v-col cols="12" class="pb-0">
          <v-card class="py-4" color="transparent" rounded="lg">
            <template #image>
              <v-img position="top right" />
            </template>

            <v-form>
              <v-textarea
                variant="solo"
                prepend-icon="mdi-message-outline"
                placeholder="..."
                class="text-h6"
                rounded
                v-model="text"
                hide-details
                no-resize
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
                hide-details
              >
                <template v-slot:selection="{ item }">
                  <v-chip color="primary">{{ item.title }}</v-chip>
                </template></v-select
              >
            </v-form>
          </v-card>
        </v-col>

        <v-col cols="6" v-for="(opt, i) in options" :key="i">
          <v-card
            class="py-4"
            color="surface"
            @click="opt.click()"
            append-icon="mdi-open-in-new"
            rel="noopener noreferrer"
            rounded="lg"
            :subtitle="`Continue with ${opt.domain}`"
            target="_blank"
            :title="opt.productName"
          >
            <template #prepend>
              <v-avatar>
                <v-img :src="opt.imageUrl"></v-img>
              </v-avatar>
            </template>
          </v-card>
        </v-col>
      </v-row>
    </v-responsive>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineModel, watch } from "vue";
import { randomSources, ISource } from "@/sources/index";

const props = defineProps<{ referrerUrl: string | null }>();
const text = defineModel("text", { type: String });
const embeds = defineModel("embeds", { type: Array });

interface IOption {
  imageUrl: string;
  domain: string;
  productName: string;
  click: () => void;
}

const topText = computed(() => {
  if (!props.referrerUrl) {
    return "Continue if you want to";
  }
  return `${new URL(props.referrerUrl).host} wants you to`;
});

const sources = computed<ISource[]>(() => {
  return randomSources(props.referrerUrl || window.location.href);
});

watch(
  () => props.referrerUrl,
  (url: string | null) => {
    if (!url || !sources.value) return;
    const [first] = sources.value;
    if (
      first.fulfilmentType === "redirect" &&
      props.referrerUrl &&
      first.autoredirectCondition &&
      first.autoredirectCondition({ url: new URL(url) })
    ) {
      window.location.href = first
        .linkGenerator({ text: text.value, embeds: embeds.value })
        .toString();
    }
  },
  { immediate: true }
);

const options = computed<IOption[]>(() => {
  return sources.value.map((s: ISource) => ({
    imageUrl: s.imageUrl,
    domain: s.domain,
    productName: s.productName,
    click: () => {},
  }));
});
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
