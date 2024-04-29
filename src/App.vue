<template>
  <v-app>
    <v-navigation-drawer v-model="leftNav" temporary width="350">
      <v-toolbar color="transparent">
        <v-toolbar-title>
          <v-icon start>mdi-cog</v-icon>
          App Configuration
        </v-toolbar-title>
      </v-toolbar>
      <v-list-subheader class="ml-4">Theme</v-list-subheader>
      <v-radio-group v-model="theme.global.name.value" class="ml-2">
        <v-radio label="Light Theme" value="light"></v-radio>
        <v-radio label="Dark Theme" value="dark"></v-radio>
      </v-radio-group>
      <v-list-subheader class="ml-4">Auto-redirects</v-list-subheader>
      <v-alert type="info" variant="text">
        If the referrer is well known, should the app redirect automatically. I.e. if
        linked from warpcast should it redirect to warpcast.com instantly.
      </v-alert>
      <v-switch
        class="ml-4"
        v-for="s in autoRedirects"
        :key="s.domain"
        v-model="s.isAutoredirect"
        @update:model-value="autoRedirectChanged(s.domain, s.isAutoredirect)"
        :label="s.name"
        hide-details
        color="info"
      ></v-switch>
      <v-list></v-list>
    </v-navigation-drawer>
    <v-app-bar color="transparent" flat>
      <v-btn icon @click="leftNav = true">
        <v-icon>mdi-cog</v-icon>
      </v-btn>

      <v-spacer></v-spacer>
      <v-btn
        size="large"
        :color="githubBtnColor"
        variant="flat"
        target="_blank"
        href="https://github.com/0xSemicolon/composecastxyz"
      >
        <v-icon start>mdi-github</v-icon>
        View on Github
      </v-btn>
    </v-app-bar>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import { useTheme } from "vuetify";
import ComposeCastDb from "@/databases/composeCastDb";
import {
  listSourceConfigs,
  patchSourceConfig,
  ISourceConfig,
} from "@/databases/sourceConfig";
import { ALL_SOURCES } from "@/sources/index";

const theme = useTheme();

interface IAutoredirectConfig {
  domain: string;
  name: string;
  isAutoredirect: boolean;
}

const autoRedirects = ref<IAutoredirectConfig[]>([]);
const leftNav = ref(false);

const githubBtnColor = computed(() => {
  if (theme.global.current.value.dark) {
    return "white";
  } else {
    return "black";
  }
});

const autoRedirectChanged = async (domain: string, isAutoredirect: boolean) => {
  await patchSourceConfig(ComposeCastDb, domain, {
    automaticallyContinue: isAutoredirect,
  });
};

watch(leftNav, async (v: boolean) => {
  if (!v) return;
  const configs: [string, ISourceConfig][] = await listSourceConfigs(ComposeCastDb);
  const configLookup = configs.reduce((a, [key, cfg]) => {
    const domain = key.substring("source:".length);
    a[domain] = cfg.automaticallyContinue;
    return a;
  }, {} as { [domain: string]: boolean });
  autoRedirects.value = [];
  ALL_SOURCES.forEach((src) => {
    if (src.fulfilmentType === "redirect") {
      const cfg = configLookup[src.domain];
      autoRedirects.value.push({
        domain: src.domain,
        name: src.productName,
        isAutoredirect: cfg !== undefined ? cfg : true,
      });
    }
  });
});
</script>
