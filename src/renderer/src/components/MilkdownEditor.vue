<script setup lang='ts'>
import { Editor, rootCtx, defaultValueCtx } from "@milkdown/core";
import { nord } from "@milkdown/theme-nord";
import { VueEditor, useEditor } from "@milkdown/vue";
import { commonmark } from "@milkdown/preset-commonmark";
import { history } from "@milkdown/plugin-history";
import { gfm } from "@milkdown/preset-gfm";
import { clipboard } from "@milkdown/plugin-clipboard";
import { cursor } from "@milkdown/plugin-cursor";
import { slash } from "@milkdown/plugin-slash";
import { emoji } from "@milkdown/plugin-emoji";
import { tooltip } from "@milkdown/plugin-tooltip";
import { upload } from "@milkdown/plugin-upload"
import { prism } from "@milkdown/plugin-prism"
import { indent, indentPlugin } from '@milkdown/plugin-indent';
import { listener, listenerCtx } from '@milkdown/plugin-listener';

let props = defineProps<{
  content: string,
}>()

let emit = defineEmits<{
  (e: 'update:content', content: string): void
}>()

const editor = useEditor((root) =>
  Editor.make()
    .config((ctx) => {
      ctx.set(rootCtx, root)
      ctx.set(defaultValueCtx, props.content)
      ctx.set(listenerCtx, {
        markdown: [(get) => {
          emit('update:content', get())
        }]
      });
    })
    .use(nord)
    .use(commonmark)
    .use(history)
    .use(listener)
    .use(gfm)
    .use(clipboard)
    .use(cursor)
    .use(slash)
    .use(emoji)
    .use(tooltip)
    .use(upload)
    .use(prism)
    .use(
      indent.configure(indentPlugin, {
        type: 'space',
        size: 4,
      }),
    )
);
</script>

<template>
  <VueEditor :editor="editor" />
</template>

<style>
.milkdown .editor {
  max-width: none !important;
  padding: 3% 6% !important;
}

.milkdown .editor p {
  text-align: justify;
}

.milkdown .editor .code-fence_value {
  border: none;
  height: 0.8cm;
  width: 3.2cm;
  margin: 0px 5px 15px 20px;
}

.milkdown .editor .code-fence_value span {
  text-align: center;
  padding: 0px;
}

.milkdown .editor .code-fence_select {
  width: 3.2cm;
  padding: 0px;
  margin: 0px;
}

</style>

